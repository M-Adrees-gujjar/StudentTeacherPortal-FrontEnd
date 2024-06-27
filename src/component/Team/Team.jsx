const people = [
  {
    name: 'Muhammad Adrees',
    role: 'Founder',
    imageUrl:
      'https://res.cloudinary.com/dkzca4hyd/image/upload/v1719418548/adrees_awz0gh.jpg',
  },
  {
    name: 'Sahil Abbas',
    role: 'Co-Founder',
    imageUrl:
      'https://res.cloudinary.com/dkzca4hyd/image/upload/v1719418549/sahil_tinxlx.jpg',
  },
  {
    name: 'Aimen Nasir',
    role: 'CEO',
    imageUrl:
      'https://res.cloudinary.com/dkzca4hyd/image/upload/v1719418548/amn_qf5ja0.jpg',
  },
  ]

  export default function Team() {
    return (
      <div className="bg-white py-11 sm:py-24" id="team">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet our Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
            We all work together to make our project so convient as we we can do so bundle of thanks for evry customer. Thanks
            </p>
          </div>
          <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
            {people.map((person) => (
              <li key={person.name}>
                <div className="flex items-center gap-x-6">
                  <img className="h-16 w-16 rounded-full object-contain" src={person.imageUrl} alt="" />
                  <div>
                    <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                    <p className="text-sm font-semibold leading-6 text-indigo-600">{person.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  