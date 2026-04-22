'use client'
import React, { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useDebounce } from 'use-debounce'
import { Product } from '@/payload-types'
import { georgianFontBase64 } from '@/assets/fonts/georgian-font'

interface SelectedProduct {
  id: string | number
  title: string
  price: number
  quantity: number
}

interface ExtraFee {
  label: string
  amount: number
}

interface ExtraMaterial {
  label: string
  price: number
  quantity: number
}

export default function InvoiceGenerator() {
  const [text, setText] = useState('')
  const [query] = useDebounce(text, 500)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<SelectedProduct[]>([])
  const [discount, setDiscount] = useState(0)

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientTaxId, setClientTaxId] = useState('')
  const [clientAddress, setClientAddress] = useState('')

  const [extraFees, setExtraFees] = useState<ExtraFee[]>([
    { label: '', amount: 0 },
    { label: '', amount: 0 },
  ])

  const [extraMaterials, setExtraMaterials] = useState<ExtraMaterial[]>([
    { label: '', price: 0, quantity: 1 },
  ])

  useEffect(() => {
    if (query.length > 2) {
      fetch(`/api/products?where[title][contains]=${query}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.docs) setProducts(data.docs)
        })
        .catch((err) => console.error('Search error:', err))
    } else {
      setProducts([])
    }
  }, [query])

  const addItem = (product: Product) => {
    const titleString =
      typeof product.title === 'object' && product.title !== null
        ? (product.title as Record<string, string>).ka ||
          (product.title as Record<string, string>).en ||
          ''
        : String(product.title || '')

    const exists = selectedItems.find((item) => String(item.id) === String(product.id))

    if (exists) {
      setSelectedItems(
        selectedItems.map((item) =>
          String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      )
    } else {
      setSelectedItems([
        ...selectedItems,
        { id: product.id, title: titleString, price: product.price, quantity: 1 },
      ])
    }
    setText('')
    setProducts([])
  }

  const addExtraFee = () => {
    if (extraFees.length < 10) {
      setExtraFees((prev) => [...prev, { label: '', amount: 0 }])
    }
  }

  const updateExtraFee = (index: number, field: 'label' | 'amount', value: string | number) => {
    setExtraFees((prev) => prev.map((fee, i) => (i === index ? { ...fee, [field]: value } : fee)))
  }

  const addExtraMaterial = () => {
    if (extraMaterials.length < 10) {
      setExtraMaterials((prev) => [...prev, { label: '', price: 0, quantity: 1 }])
    }
  }

  const updateExtraMaterial = (
    index: number,
    field: 'label' | 'price' | 'quantity',
    value: string | number,
  ) => {
    setExtraMaterials((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  const materialsTotal = extraMaterials.reduce(
    (acc, m) => acc + (Number(m.price) || 0) * (Number(m.quantity) || 0),
    0,
  )
  const subtotal =
    selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + materialsTotal
  const extraFeesTotal = extraFees.reduce((acc, fee) => acc + (Number(fee.amount) || 0), 0)
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount + extraFeesTotal

  const generatePDF = () => {
    const doc = new jsPDF()

    doc.addFileToVFS('Sylfaen.ttf', georgianFontBase64)
    doc.addFont('Sylfaen.ttf', 'Sylfaen', 'normal')
    doc.setFont('Sylfaen', 'normal')

    const themeColor: [number, number, number] = [25, 118, 186]
    const textColor: [number, number, number] = [50, 50, 50]
    const lightText: [number, number, number] = [100, 100, 100]
    const today = new Date().toLocaleDateString('ka-GE')

    doc.setFontSize(14)
    doc.setTextColor(...textColor)
    doc.text('შპს აი-ტექნო (I-TECHNO LLC)', 14, 20)

    doc.setFontSize(26)
    doc.setTextColor(...themeColor)
    doc.text('ინვოისი', 196, 20, { align: 'right' })

    doc.setFontSize(12)
    doc.setTextColor(...textColor)
    doc.text(`ინვოისის #: ${invoiceNumber}`, 196, 28, { align: 'right' })
    doc.text(`თარიღი: ${today}`, 196, 35, { align: 'right' })

    doc.setFontSize(10)
    doc.setTextColor(...themeColor)
    doc.text('ადრესატი', 14, 30)

    doc.setFontSize(12)
    doc.setTextColor(...textColor)
    doc.text(clientName, 14, 37)

    doc.setFontSize(10)
    doc.setTextColor(...lightText)
    doc.text(`ს/კ: ${clientTaxId}`, 14, 43)
    if (clientAddress) {
      doc.text(`მის: ${clientAddress}`, 14, 48)
    }

    // პროდუქტები + დამატებითი მასალები ერთ ცხრილში
    const tableBody = selectedItems.map((item) => [
      String(item.quantity),
      item.title,
      `${item.price.toFixed(2)} GEL`,
      `${(item.price * item.quantity).toFixed(2)} GEL`,
    ])

    extraMaterials.forEach((m) => {
      if (m.label && Number(m.price) > 0) {
        const qty = Number(m.quantity) || 1
        const price = Number(m.price) || 0
        tableBody.push([
          String(qty),
          m.label,
          `${price.toFixed(2)} GEL`,
          `${(price * qty).toFixed(2)} GEL`,
        ])
      }
    })

    autoTable(doc, {
      startY: clientAddress ? 68 : 62,
      head: [['რაოდ.', 'აღწერა', 'საცალო ფასი', 'ჯამი']],
      body: tableBody,
      theme: 'plain',
      styles: {
        font: 'Sylfaen',
        fontSize: 10,
        textColor: textColor,
        cellPadding: { top: 5, right: 3, bottom: 5, left: 3 },
        valign: 'middle',
      },
      headStyles: {
        fillColor: themeColor,
        textColor: [255, 255, 255],
        fontStyle: 'normal',
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        1: { halign: 'left', cellWidth: 'auto' },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 35 },
      },
      tableWidth: 'auto',
      didDrawCell: function (data) {
        if (data.row.section === 'body' && data.column.index === 0) {
          const { x, y } = data.cell
          doc.setDrawColor(220)
          doc.line(
            x,
            y + data.cell.height,
            x + doc.internal.pageSize.width - 28,
            y + data.cell.height,
          )
        }
      },
    })

    // @ts-expect-error - finalY
    let currentY = doc.lastAutoTable.finalY
    doc.setDrawColor(...themeColor)
    doc.setLineWidth(0.4)
    doc.line(14, currentY, 196, currentY)

    currentY += 8
    const valueX = 196
    const totalsLabelX = 140
    doc.setFontSize(10)
    doc.setTextColor(...textColor)
    doc.text('ჯამი', totalsLabelX, currentY)
    doc.text(`${subtotal.toFixed(2)} GEL`, valueX, currentY, { align: 'right' })

    extraFees.forEach((fee) => {
      if (fee.label && Number(fee.amount) > 0) {
        currentY += 8
        doc.setTextColor(...textColor)
        doc.text(`${fee.label}:`, totalsLabelX, currentY)
        doc.text(`${Number(fee.amount).toFixed(2)} GEL`, valueX, currentY, { align: 'right' })
      }
    })

    if (discount > 0) {
      currentY += 8
      doc.setTextColor(220, 38, 38)
      doc.text(`ფასდაკლება (${discount}%):`, totalsLabelX, currentY)
      doc.text(`- ${discountAmount.toFixed(2)} GEL`, valueX, currentY, { align: 'right' })
      doc.setTextColor(...textColor)
    }

    currentY += 4
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(totalsLabelX, currentY, valueX, currentY)

    currentY += 11
    doc.setFontSize(11)
    doc.setTextColor(...themeColor)
    doc.text('სულ (GEL)', totalsLabelX, currentY)
    doc.text(`${total.toFixed(2)} GEL`, valueX, currentY, { align: 'right' })

    currentY += 12
    doc.setFontSize(11)
    doc.setTextColor(...themeColor)
    doc.text('საბანკო რეკვიზიტები:', 14, currentY)
    doc.setFontSize(10)
    doc.setTextColor(...lightText)
    doc.text(
      `მიმწოდებელი: შპს აიტეჩნო/ITECHNO LTD\nბანკი: თიბისი ბანკი\nIBAN: GE85TB7712236080100008\nინვოისი ძალაშია აღნიშნული თარიღიდან 1 კვირა\nსრული თანხა დღგ-ს ჩათვლით`,
      14,
      currentY + 6,
    )

    doc.save(`Invoice_${invoiceNumber || new Date().getTime()}.pdf`)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-xl rounded-2xl my-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">ინვოისის გენერატორი</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="ინვოისის №"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA]"
        />
        <input
          placeholder="კლიენტის სახელი"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA]"
        />
        <input
          placeholder="ს/კოდი"
          value={clientTaxId}
          onChange={(e) => setClientTaxId(e.target.value)}
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA]"
        />
        <input
          placeholder="მისამართი"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA]"
        />
      </div>

      {/* დამატებითი ხარჯები */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-3 font-bold">დამატებითი ხარჯები</label>
        <div className="flex flex-col gap-3">
          {extraFees.map((fee, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                placeholder={index === 0 ? 'მაგ. დამატებითი ხარჯი' : 'მაგ. ხელობის საფასური'}
                value={fee.label}
                onChange={(e) => updateExtraFee(index, 'label', e.target.value)}
                className="flex-1 border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA]"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={fee.amount === 0 ? '' : fee.amount}
                onChange={(e) => updateExtraFee(index, 'amount', parseFloat(e.target.value) || 0)}
                className="w-36 border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA] text-right"
              />
              <span className="text-gray-500 text-sm font-medium w-8">GEL</span>
            </div>
          ))}
        </div>
        {extraFees.length < 10 && (
          <button
            onClick={addExtraFee}
            className="mt-3 text-sm text-[#1976BA] hover:text-blue-800 font-semibold transition-colors"
          >
            + ხარჯის დამატება
          </button>
        )}
      </div>

      {/* დამატებითი მასალები */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-3 font-bold">დამატებითი მასალები</label>
        <div className="flex flex-col gap-3">
          {extraMaterials.map((m, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                placeholder="მასალის დასახელება"
                value={m.label}
                onChange={(e) => updateExtraMaterial(index, 'label', e.target.value)}
                className="flex-1 border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA]"
              />
              <input
                type="number"
                min="1"
                step="1"
                placeholder="რაოდ."
                value={m.quantity === 0 ? '' : m.quantity}
                onChange={(e) =>
                  updateExtraMaterial(index, 'quantity', parseInt(e.target.value) || 1)
                }
                className="w-24 border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA] text-center"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={m.price === 0 ? '' : m.price}
                onChange={(e) =>
                  updateExtraMaterial(index, 'price', parseFloat(e.target.value) || 0)
                }
                className="w-36 border p-2 rounded outline-none focus:ring-2 focus:ring-[#1976BA] text-right"
              />
              <span className="text-gray-500 text-sm font-medium w-8">GEL</span>
            </div>
          ))}
        </div>
        {extraMaterials.length < 10 && (
          <button
            onClick={addExtraMaterial}
            className="mt-3 text-sm text-[#1976BA] hover:text-blue-800 font-semibold transition-colors"
          >
            + მასალის დამატება
          </button>
        )}
      </div>

      {/* პროდუქტის ძებნა */}
      <div className="relative mb-10">
        <label className="block text-sm text-gray-600 mb-2 font-bold">პროდუქტის ძებნა</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="მოძებნე პროდუქტი..."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1976BA]"
        />
        {products.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-100 mt-2 shadow-2xl z-50 rounded-xl overflow-hidden">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-0"
                onClick={() => addItem(p)}
              >
                <span className="font-semibold text-gray-700">
                  {typeof p.title === 'object' ? (p.title as Record<string, string>).ka : p.title}
                </span>
                <span className="text-[#1976BA] font-bold">{p.price} GEL</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItems.length > 0 ? (
        <div className="overflow-x-auto mb-8 border rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">პროდუქტი</th>
                <th className="p-4 text-center">რაოდენობა</th>
                <th className="p-4 text-right">ჯამი</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {selectedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-800 font-medium">{item.title}</td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1
                        setSelectedItems(
                          selectedItems.map((si) =>
                            si.id === item.id ? { ...si, quantity: val } : si,
                          ),
                        )
                      }}
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} GEL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl mb-8 border-2 border-dashed border-gray-200 text-gray-400">
          სია ცარიელია
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-2 flex-wrap justify-center">
          {[0, 10, 15, 20, 50].map((val) => (
            <button
              key={val}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${discount === val ? 'bg-[#1976BA] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setDiscount(val)}
            >
              {val}%
            </button>
          ))}
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs font-bold mb-1">სულ გადასახდელი</p>
          <p className="text-4xl font-black text-[#1976BA]">{total.toFixed(2)} GEL</p>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="w-full mt-10 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-xl"
      >
        ჩამოტვირთე PDF ინვოისი
      </button>
    </div>
  )
}
