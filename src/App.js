import React, {useState} from 'react';
import CarouselPage from './carousel/CarouselPage';
import CarouselLibPage from "./carousel/CarouselLibPage";
import CarouselLibPage2 from "./carousel/CarouselLibPage2";
import CarouselLibPage3 from "./carousel/version-3/CarouselLibPage3";
import AddEntryModal from "./add-carousel/add-entry-modal.component";
import CarouselLibPage4 from "./carousel/version-4/CarouselLibPage4";
import MyPage from "./carousel/version-4/CarouselExample";

function App() {
    return <>
        {/*<CarouselPage />*/}
        {/*<br/>*/}
        {/*<CarouselLibPage/>*/}
        {/*<br/>*/}
        {/*<div style={{fontWeight: "bold"}}>Version 2</div>*/}
        {/*<CarouselLibPage2/>*/}
        <div style={{fontWeight: "bold"}}>Version 4</div>
        <CarouselLibPage3/>
        <MyPage/>
    </>
    ;
}

export default App;