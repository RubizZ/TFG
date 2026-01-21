import styles from "./SearchFlight.module.css"
import Globe from "./Globe.tsx"

function SearchFlight() {
    return (
        <div className={styles.searchPage}>
            <div className={styles.searchContainer}>
                <div className={styles.origin}>
                    <input type="text" placeholder="Origin"/>
                    <input type="date" placeholder="Date"/>
                </div>
                <div>
                    Switch
                </div>
                <div className={styles.destination}>
                    <input type="text" placeholder="Destination" />
                    <input type="date" placeholder="Date"/>
                </div>
                <div className={styles.options}>
                    <select name="" id="">
                        <option value="oneWay">One way</option>
                        <option value="roundTrip" selected>Round trip</option>
                    </select>
                    <button>Add stop</button>
                </div>
            </div>
            <Globe />
            <button className={styles.btnBuscar}>Buscar vuelos</button>
        </div>
    )
}

export default SearchFlight;