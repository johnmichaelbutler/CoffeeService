import Head from 'next/head'
import Image from 'next/image'

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
            // width="100"
            // height="100"
            className="object-cover filter-image"
          />
        </div>
        <div className="h-screen overflow-hidden">
          <div className="h-24 w-1/2 text-center bg-gray-100 mx-auto my-auto">
              <h1 className="">Welcome to coffee service</h1>
          </div>

        </div>
      </main>
    </div>
  )
}
