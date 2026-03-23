import React from 'react';
import CarouselPage from './carousel/CarouselPage';
import CarouselLibPage from "./carousel/CarouselLibPage";
import CarouselLibPage2 from "./carousel/CarouselLibPage2";
import CarouselLibPage3 from "./carousel/version-3/CarouselLibPage3";

function App() {
    return <>
        {/*<CarouselPage />*/}
        {/*<br/>*/}
        {/*<CarouselLibPage/>*/}
        {/*<br/>*/}
        {/*<div style={{fontWeight: "bold"}}>Version 2</div>*/}
        {/*<CarouselLibPage2/>*/}
        <div style={{fontWeight: "bold"}}>Version 3</div>
        <CarouselLibPage3/>
    </>
    ;
}

export default App;