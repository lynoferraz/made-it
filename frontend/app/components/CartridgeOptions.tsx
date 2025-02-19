"use client"

import { Tab } from "@headlessui/react";
import GamesIcon from '@mui/icons-material/Games';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';


import { CartridgeInfo } from "@/app/libs/app/ifaces";
import { Suspense } from "react";
import Rivemu from "@/app/components/Rivemu";
import CartridgeGameplays from "./CartridgeGameplays";


function loadingFallback() {
    return (
        <div className="btn w-full p-4 flex justify-center element">
            <div className='w-16 h-16 border-2 rounded-full border-current border-r-transparent animate-spin'></div>
        </div>
    )
}

type CartridgeOptionProps = {
    cartridge:CartridgeInfo,
    children: {
        achievements:React.ReactNode
    }
}

export default function CartridgeOptions({props}:{props:CartridgeOptionProps}) {
    return (
        <Tab.Group>
            <Tab.List className="tabs-header">
                <Tab
                    className={({selected}) => {return selected?"tabs-option-selected":"tabs-option"}}
                    >
                        <span className='flex justify-center items-center text-xl'>
                            <EmojiEventsIcon/>
                            <span className="ms-1">Achievements</span>
                        </span>
                </Tab>

                <Tab
                    className={({selected}) => {return selected?"tabs-option-selected":"tabs-option"}}
                    >
                        <span className='flex justify-center items-center text-xl'>
                            <GamesIcon/>
                            <span className="ms-1">Gameplays</span>
                        </span>
                </Tab>

                <Tab
                    className={({selected}) => {return selected?"tabs-option-selected":"tabs-option"}}
                    >
                        <span className='flex justify-center items-center text-xl'>
                            <VideogameAssetIcon/>
                            <span className="ms-1">Play</span>
                        </span>
                </Tab>

            </Tab.List>

            <Tab.Panels className="tab-content">
                <Tab.Panel className="">
                    <Suspense fallback={loadingFallback()}>
                        {/* <CartridgeAchievements cartridge_id={cartridge.id}/> */}
                        {props.children.achievements}
                    </Suspense>
                </Tab.Panel>
    
                <Tab.Panel className="">
                    <CartridgeGameplays cartridge_id={props.cartridge.id}/>
                </Tab.Panel>

                <Tab.Panel className="">
                    <Rivemu cartridge={props.cartridge}/>
                </Tab.Panel>

            </Tab.Panels>
        </Tab.Group>
    );
}