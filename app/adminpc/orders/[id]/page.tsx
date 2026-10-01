import { notFound, redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getOrderById } from '@/lib/orders'
import { OrderDetailView } from '../order-detail'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const authenticated = await isAdmin()
  if (!authenticated) redirect('/adminpc')

  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return <OrderDetailView order={order} />
}
