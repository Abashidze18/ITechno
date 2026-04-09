import { CollectionConfig } from 'payload'

export const ContactInfo: CollectionConfig = {
  slug: 'contact-info',
  admin: {
    useAsTitle: 'title',
    group: 'Contact Page',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Contact Info',
      admin: {
        description: 'მხოლოდ Admin პანელში გამოჩნდება',
      },
    },
    {
      name: 'infoTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'socials',
      label: 'Social Networks',
      type: 'array',
      fields: [
        {
          name: 'platformName',
          label: 'Platform Name',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'მაგ: Facebook, Instagram...',
          },
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          required: true,
          defaultValue: 'facebook',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Youtube', value: 'youtube' },
            { label: 'Globe / Website', value: 'globe' },
          ],
        },
        {
          name: 'url',
          label: 'Link',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'https://...',
          },
        },
      ],
    },
    {
      name: 'address',
      type: 'text',
      localized: true,
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      admin: {
        description: 'Google Maps embed src URL',
      },
    },
  ],
}
