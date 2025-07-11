import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { styles } from '../styles';
import { navLinks } from '../constants';
import { zoe, bwmap, worldmap } from '../assets';

const Hero = () => {
  return (
    <>
      {/* Background Maps */}
      <div className="absolute top-0 left-0 z-0 h-[100vh] w-screen">
        <img
          src={bwmap}
          alt="world map"
          className="w-full h-full sm:block hidden object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 z-0 h-[100vh] w-screen">
        <img
          src={worldmap}
          alt="world map"
          className="w-full h-full sm:hidden block object-cover"
        />
      </div>

      {/* Main Hero Section */}
      <section
        className="relative flex sm:flex-row flex-col w-full h-screen mx-auto 
        sm:bg-hero bg-hero-mobile overflow-hidden"
      >
        {/* Text Section */}
        <div
          className={`absolute inset-0 sm:top-[250px] top-[150px] 
          lg:top-[150px] xl:top-[250px] ${styles.paddingX} 
          max-w-7xl mx-auto flex flex-row items-start
          justify-between gap-3`}
        >
          {/* Side Indicator */}
          <div className="flex flex-col justify-center items-center mt-5 ml-3">
            <div className="w-5 h-5 rounded-full bg-[#0a0a0a] sm:hidden" />
            <div className="w-1 sm:h-80 h-40 bw-gradient sm:hidden" />
          </div>

          {/* Text Content */}
          <div>
            <h1
              className={`${styles.heroHeadText} text-eerieBlack font-poppins uppercase`}
            >
              Hi, I'm{' '}
              <span
                className="sm:text-battleGray sm:text-[90px] 
                text-eerieBlack text-[50px] font-mova
                font-extrabold uppercase"
              >
                Zoe
              </span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-eerieBlack`}>
              A Computer Scientist passionate about building intelligent systems,
              <br className="sm:block hidden" />
              solving real-world problems, and delivering beautiful web experiences.
            </p>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div
          className="absolute xs:bottom-10 bottom-32 w-full 
          flex justify-center items-center"
        >
          <a href="#about">
            <div
              className="w-[35px] h-[64px] rounded-3xl border-4 
              border-french border-dim flex
              justify-center items-start p-2"
            >
              <motion.div
                animate={{ y: [0, 24, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="w-3 h-3 rounded-full bg-taupe mb-1"
              />
            </div>
          </a>
        </div>

        {/* Profile Image with Glow Ring */}
        <div className="absolute bottom-0 right-10 flex justify-end items-end w-full h-full z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            {/* Gradient Ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#ff7e5f] to-[#1e3c72] blur-2xl opacity-30 animate-pulse"></div>

            {/* Profile Image */}
            <img
              src={zoe}
              alt="Zoe Ayilara"
              className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] 
              rounded-full object-cover border-4 border-primary shadow-xl 
              hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
