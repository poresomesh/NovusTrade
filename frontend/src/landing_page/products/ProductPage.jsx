import React from "react";
import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

function ProductsPage() {
    return (
        <>
            <Hero />


            <LeftSection
                imageURL="media/ProductImage1.png"
                productName="NovusTrade Terminal"
                productDescription="Our ultra-fast flagship trading terminal featuring real-time streaming market data, advanced charting, and integrated machine learning probability scores for every asset."
                tryDemo="#"
                learnMore="#"
                googlePlay="#"
                appStore="#"
            />

           
            <RightSection
                imageURL="media/ProductImage2.png"
                productName="Novus AI API & Quant Engine"
                productDescription="Build and deploy algorithmic strategies using our low-latency Python/Flask endpoints. Access live order books and plug your automated trading bots directly into our ecosystem."
                learnMore="#"
            />

     
            <LeftSection
                imageURL="media/ProductImage3.png"
                productName="Novus Analytics & RAG Hub"
                productDescription="The reporting and intelligence backbone of your portfolio. Ask our RAG-driven AI assistant questions directly against company quarterly earnings and technical indicators."
                tryDemo="#"
                learnMore="#"
                googlePlay="#"
                appStore="#"
            />

            <Universe />
        </>
    );
}

export default ProductsPage;