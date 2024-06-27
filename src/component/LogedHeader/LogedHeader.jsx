import { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Setting(props) {
  const {handelClick} = props

  const [navigation  , setNavigation] = useState([
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#team', current: false },
    { name: 'Projects', href: '#project', current: false },
    { name: 'Contact Us', href: '#contact', current: false },
  ])

function handelLink(item){
  const abc = navigation.map((elm)=> elm.name === item ? {...elm , current :  true} : {...elm , current : false});
  setNavigation(abc)
}

  return (
    <Disclosure as="nav" className={"fixed w-screen bg-white z-10"}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 shadow-slate-600 shadow-sm">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex justify-center align-middle rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white items-center">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-16 w-auto"
                    src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1717440991/00_logo_x3dtn2.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block self-center">
                  <div className="flex space-x-4">
                    {navigation.map((item , i) => (
                    <a
                    key={i}
                    href={item.href}
                    className={`${item.current ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium`}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={()=>handelLink(item.name , i)}
                  >
                    {item.name}
                  </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-x-6">
              <Link to="/signUp"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <button onClick={handelClick} className="text-sm font-semibold leading-6 text-gray-900">
                Log In <span aria-hidden="true">→</span>
              </button>
            </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : ' hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
