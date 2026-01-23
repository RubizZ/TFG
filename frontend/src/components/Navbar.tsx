function Navbar() {

  return (
    <>
      <nav className='flex items-center justify-between p-3'>
          <h2 className="text-xl">AppName</h2>
          <div className='flex items-center gap-14'>
              <div className='flex gap-9'>
                  <a className='cursor-pointer'>Explore</a>
                  <a className='cursor-pointer'>About us</a>
                  <a className='cursor-pointer'>Contact</a>
              </div>
              <div className='flex gap-1.5'>
                <button className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-1.5 rounded-full">Log in</button>
                <button className="bg-zinc-800 hover:bg-zinc-900 text-white px-5 py-1.5 rounded-full">Register</button>
              </div>
          </div>
      </nav>
      <hr />
    </>
  )
}

export default Navbar
