import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import CustomButton from '../components/custom-button';

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Coffee Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full pt-16">
        <div className="fixed h-screen w-screen overflow-hidden neg-z-index" >
          <Image
            src="/homepageImage.jpg"
            alt="Homepage Background Image"
            layout="fill"
            quality={100}
            className="object-cover filter-image"
          />
        </div>
        <div className="h-screen overflow-hidden">
          <div className="mt-24 h-48 lg:h-60 w-1/2 lg:w-1/3 text-center bg-gray-100-see-through mx-auto my-auto">
            <h1 className="font-bold text-xl pt-10">Welcome to Coffee Service</h1>
            <div className="mt-5">
                <Link href="/menu" passHref>
              <CustomButton>
                  <a className="text-sm w-full h-full">See the Menu</a>
              </CustomButton>
                </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
