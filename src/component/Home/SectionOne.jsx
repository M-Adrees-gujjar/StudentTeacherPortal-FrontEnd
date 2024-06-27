const SectionOne = () => {
    return (
        <section className="container mx-auto px-6 pt-36 mb-5 flex flex-wrap lg:flex-nowrap" id="section_one">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Take Online <br /> Exams
                </h1>
                <h2 className="text-2xl lg:text-3xl mb-2">
                NUMBER OF ACTIVE USERS
                </h2>
                <h1 className="text-4xl lg:text-5xl font-bold">
                200+
                </h1>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center items-center mt-5 lg:mt-0">
                <div className="img lg:w-2/4 sm:w-full h-72">
                    <img src="https://res.cloudinary.com/dkzca4hyd/image/upload/v1717440991/01_index_xu5bwc.jpg" alt="Image" className="w-full h-full object-cover" />
                </div>
            </div>
        </section>
    );
};

export default SectionOne;
