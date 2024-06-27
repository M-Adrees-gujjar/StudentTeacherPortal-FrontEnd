
const SectionTwo = () => {
  return (
    <section className="section_two flex flex-col pt-5 pb-5" id="project">
      <div className="two_heading container-fluid flex justify-between">
        <h1 className="text-black font-semibold text-3xl ms-8">Explore Exams</h1>
        <div className="two_heading_button relative my-5">
          <button
            type="button"
            className="btn button-1 transition-all duration-500 w-[150px] h-[50px] bg-white hover:bg-gray-500 me-5 border-blue-600 border-2 rounded-md hover:border-none hover:text-white"
          >
            Explore All
          </button>
          <div className="btn-overlay">
            <div className="child-box-overlay">
              <div className="btn-overlay-box-1"></div>
              <div className="btn-overlay-box-2"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="section_two_child flex justify-between container mx-auto  w-11/12">
        <div className="two_box col-lg-4 col-12">
          <div className="two_box_child two_box_first flex flex-col justify-center items-center gap-3 bg-blue-400 rounded-md my-4 py-8 bottom-[0%] transition-all duration-500 hover:bottom-[5%] hover:relative hover:shadow-lg">
            <div className="img w-1/2 h-2/5">
              <img src="/src/assets/Images/01_index.jpg" alt="" className="rounded-full w-full h-full" />
            </div>
            <h2 className="font-semibold text-white">Primary Exams</h2>
          </div>
        </div>
        <div className="two_box col-lg-4 col-12">
          <div className="two_box_child two_box_second flex flex-col justify-center items-center bg-blue-400 gap-3 rounded-md my-4 py-8 bottom-[0%] transition-all duration-500 hover:bottom-[5%] hover:relative hover:shadow-lg">
            <div className="img w-1/2 h-2/5">
              <img src="/src/assets/Images/01_index.jpg" alt="" className="rounded-full w-full h-full" />
            </div>
            <h2 className="font-semibold text-white">Bank Exams</h2>
          </div>
        </div>
        <div className="two_box col-lg-4 col-12">
          <div className="two_box_child two_box_third flex flex-col justify-center items-center bg-blue-400 gap-3 rounded-md my-4 py-8 bottom-[0%] transition-all duration-500 hover:bottom-[5%] hover:relative hover:shadow-lg">
            <div className="img w-1/2 h-2/5">
              <img src="/src/assets/Images/01_index.jpg" alt="" className="rounded-full w-full h-full" />
            </div>
            <h2 className="font-semibold text-white">Other Exams</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;




// const products = [
//     {
//       id: 1,
//       name: 'Basic Tee',
//       href: '#',
//       imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
//       imageAlt: "Front of men's Basic Tee in black.",
//       price: '$35',
//       color: 'Black',
//     },
//     // More products...
//   ]
  
//   export default function Project() {
//     return (
//       <div className="bg-white" id="project">
//         <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
//           <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
  
//           <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
//             {products.map((product) => (
//               <div key={product.id} className="group relative">
//                 <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
//                   <img
//                     src={product.imageSrc}
//                     alt={product.imageAlt}
//                     className="h-full w-full object-cover object-center lg:h-full lg:w-full"
//                   />
//                 </div>
//                 <div className="mt-4 flex justify-between">
//                   <div>
//                     <h3 className="text-sm text-gray-700">
//                       <a href={product.href}>
//                         <span aria-hidden="true" className="absolute inset-0" />
//                         {product.name}
//                       </a>
//                     </h3>
//                     <p className="mt-1 text-sm text-gray-500">{product.color}</p>
//                   </div>
//                   <p className="text-sm font-medium text-gray-900">{product.price}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }
  