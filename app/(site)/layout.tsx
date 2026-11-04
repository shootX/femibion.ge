import { getSiteTexts } from '@/lib/texts'
import { getImagePaths } from '@/lib/images-server'
import { Header } from '@/components/femibion/header'

export const revalidate = 3600

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [texts, images] = await Promise.all([getSiteTexts(), getImagePaths()])
  return (
    <>
      <Header texts={texts.header} images={images} />
      {children}
    </>
  )
}
