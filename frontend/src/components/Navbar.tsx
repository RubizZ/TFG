import styles from "./Navbar.module.css"

function Navbar() {

  return (
    <>
      <nav className={styles.navbar}>
          <h2>AppName</h2>
          <div className={styles.actions}>
              <div className={styles.links}>
                  <a className={styles.link}>Explore</a>
                  <a className={styles.link}>About us</a>
                  <a className={styles.link}>Contact</a>
              </div>
              <div className={styles.auths}>
                <button>Log in</button>
                <button>Register</button>
              </div>
          </div>
      </nav>
      <hr />
    </>
  )
}

export default Navbar
