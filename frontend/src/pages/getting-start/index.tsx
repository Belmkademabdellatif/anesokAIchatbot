import dynamic from 'next/dynamic'

const GettingStartForm = dynamic(()=>import('@anesok/components/gettingStart/GettingStartForm'))

export default function index() {
  return <GettingStartForm/>
}
