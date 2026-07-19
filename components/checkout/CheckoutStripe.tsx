// "use client";

// import { Elements } from "@stripe/react-stripe-js";
// import { stripePromise } from "@/lib/stripe-client";
// import CheckoutPayment from "./CheckoutPayment";


// export default function CheckoutStripe({
//     clientSecret,
// }:{
//     clientSecret:string;
// }){

//     return (
//        {showPayment &&
//     clientSecret && (
//         console.log("ELEMENTS OPEN"),
//         <div className="mt-8">
//             <Elements
//                 key={clientSecret}
//                 stripe={stripePromise}
//                 options={{
//                     clientSecret,
//                 }}
//             >
//                 <CheckoutPayment />
//             </Elements>
//         </div>
//     )}
//     )
// }