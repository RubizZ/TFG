import { useState } from "react";
import Globe from "./Globe.tsx"
import { ArrowLeftRight, Plus } from "lucide-react";

function SearchFlight() {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");

    const handleSwitch = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    }

    const handleMapSelect = (iata: string) => {
        if (!origin) {
            setOrigin(iata);
        } else if (!destination && origin !== iata) {
            setDestination(iata);
        } else {
            setOrigin(iata);
            setDestination("");
        }
    }

    return (
        <div className='flex flex-col items-center justify-center gap-5'>
            <div className='flex items-center justify-center gap-5 mt-5'>
                <div className='flex flex-col gap-2.5'>
                    <input 
                        type="text" 
                        placeholder="Origin" 
                        className='border border-solid border-slate-700 px-1 py-1 rounded-md'
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                        maxLength={3}
                    />
                    <input type="date" placeholder="Date" className='border border-solid border-slate-700 px-1 py-1 rounded-md'/>
                </div>
                <button onClick={handleSwitch} className="hover:bg-gray-200 p-2 rounded-full transition">
                    <ArrowLeftRight />
                </button>
                <div className='flex flex-col gap-2.5'>
                    <input 
                        type="text" 
                        placeholder="Destination" 
                        className='border border-solid border-slate-700 px-1 py-1 rounded-md'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value.toUpperCase())}
                        maxLength={3}
                    />
                    <input type="date" placeholder="Date" className='border border-solid border-slate-700 px-1 py-1 rounded-md'/>
                </div>
                <div className='flex flex-col gap-3 items-center justify-center'>
                    <select name="" id="" className='border border-slate-700 hover:bg-gray-200 rounded-full px-1.5 py-1'>
                        <option value="oneWay">One way</option>
                        <option value="roundTrip" selected>Round trip</option>
                    </select>
                    <div className='flex items-center justify-center gap-1.5'>
                        <button className="border border-slate-600 rounded-full hover:bg-gray-200">
                            <Plus/>
                        </button>
                        Add stop
                    </div>
                </div>
            </div>
            <Globe 
                onAirportSelect={handleMapSelect}
                selectedAirports={[origin, destination]}
            />
            <button className='border border-slate-700 hover:bg-gray-200 rounded-full px-5 py-1.5'>Buscar vuelos</button>
        </div>
    )
}

export default SearchFlight;