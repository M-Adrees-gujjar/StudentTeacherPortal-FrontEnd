import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="bg-gray-900 pt-4 sm:py-12 text-white" id="contact">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-white">
          Connect with Me Online
        </h2>
        <div className="mx-auto mt-10 flex justify-center items-center gap-10">
          <NavLink to="https://www.instagram.com/adreesGujjar" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center">
            <img
              className="max-h-12 w-full object-contain transition-transform duration-300 hover:scale-110"
              src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1715952804/instagram_dv0kwt.png"
              alt="Instagram"
              width={158}
              height={48}
            />
          </NavLink>
          <NavLink to="https://www.linkedin.com/in/muhammad-adrees-833210241/" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center">
            <img
              className="max-h-12 w-full object-contain transition-transform duration-300 hover:scale-110"
              src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1715952804/LinkdIn_vsadd6.png"
              alt="LinkedIn"
              width={158}
              height={48}
            />
          </NavLink>
          <NavLink to="https://github.com/M-Adrees-gujjar" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center">
            <img
              className="max-h-12 w-full object-contain transition-transform duration-300 hover:scale-110"
              src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1715952804/github_xh1tkp.png"
              alt="GitHub"
              width={158}
              height={48}
            />
          </NavLink>
        </div>
      </div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-black text-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
        <img
            src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1715955099/address_xbe64p.png"
            className="h-7 w-7"
            alt=""  />
          <p>Ali Town , Lahore</p>
        </div>
        <div className="flex items-center space-x-2">
        <img
            src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1715955099/phone_kd6hl9.png"
            className="h-7 w-7"
            alt=""  />
          <p>+92 303 8084601</p>
        </div>
        <div className="flex items-center space-x-2">
            <img
            src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1715955099/email_oby0db.png"
            className="h-6 w-8"
            alt=""  />
          <p>madreesgujjar522@gmail.com</p>
        </div>
      </div>
    </div>
    </div>
  );
}