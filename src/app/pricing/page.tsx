
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CircleCheck, ShieldCheck, Landmark, ShieldPlus } from "lucide-react";


type PricingPlan = {
  name: string;
  price: string;
  about: string;
  features: string[];
  cta: string;
};


const pricingPlans: PricingPlan[] = [
  {
    name: "Scholar",
    price: "$0",
    about:"Essential tools for individual students and independent learners.",
    features: [
      "AI Curation (10 papers/month)",
      "Standard Academic Integrity Check",
      "1GB Cloud Storage",
    ],
    cta:"Start Learning",
  },
  {
    name: "Researcher",
    price: "$24",
    about:"Advanced tools for serious researchers and academic professionals.",
    features: [
      "Unlimited AI Processing",
      "AI Curation (50 papers/month)",
      "Enhanced Academic Integrity Check",
      "10GB Cloud Storage",
      "Advanced Analytics and Reporting",
    ],
    cta:"Upgrade to Pro",
  },
  {
    name: "Institutional",
    price: "Custom",
    about:"Tailored solutions for educational institutions and research organizations.",
    features: [
      "AI Curation (Unlimited)",
      "Enterprise Academic Integrity Check",
      "Unlimited Cloud Storage",
      "Dedicated Support and Training",
    ],
    cta:"Contact Sales",
  },
]


export default function Pricing() {
  return (
    <div>
      <Navbar />
    
      <main className="px-4 md:px-8 lg:px-16 py-8 bg-gray-50 min-h-screen">
        
        {/* Hero Section */}
        <div className="max-w-4xl mt-12 flex flex-col items-center justify-center space-y-4 mx-auto text-center">
          <h1 className="text-3xl md:text-6xl font-semibold text-gray-800">
          Academic Excellence, <br/><span className="text-green-600">Sustainably Scaled.</span>
        </h1>
        <p className="max-w-3xl mt-3 text-sm md:text-lg text-gray-600">
          Choose the plan that fits your research journey. From solo scholars to global institutions, our AI-curated intelligence adapts to your specific academic needs.
        </p>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-full md:max-w-[1500px] mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 space-y-8 md:space-y-0 mx-auto">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`relative rounded-lg shadow-sm p-6 flex flex-col items-start justify-between text-left  ${plan.name === "Researcher" ? 'bg-[#1a2456] text-white' : 'bg-white text-gray-800' }`}>
              <h2 className="text-2xl font-semibold ">{plan.name}</h2>
              <div className="mb-6">
              <div className="flex items-baseline mt-2">
              <p className="mt-4 text-4xl font-bold ">{plan.price}</p>
              <span>{plan.name === "Scholar" ? "/forever" : plan.name === "Researcher" ? "/monthly" : ""}</span>
              </div>
               <p className="mt-4 ">{plan.about}</p>
              </div>
              <ul className="mt-2 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CircleCheck className="mr-2 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-12 w-full px-4 py-3 rounded-lg transition font-bold text-[#1a2456]`}
                style={
                  plan.name === "Scholar" ? { backgroundColor: 'transparent', border: '2px solid #1a2456' }
                    : plan.name === "Researcher" ? { backgroundColor: '#50C878' } // green
                    : { backgroundColor: '#F2F2F2' } // grey for Custom/Institutional
                }
              >
                {plan.cta}
              </button>
              {plan.name === "Researcher" && (
                <span className="absolute -top-3 left-1/3 bg-green-500 text-white px-4 py-1 rounded-2xl text-sm font-semibold">
                  MOST POPULAR
                </span>
              )}
            </div>
          ))}

        </div>

          {/*  */}
          <div className="mt-[70px] max-w-3xl flex  items-center justify-between mx-auto">
            <span className="flex items-center justify-center font-semibold text-gray-500">
                <ShieldCheck className="mr-2" />
                Secure Payment
            </span>
            <span className="flex items-center justify-center font-semibold text-gray-500">
              <Landmark className="mr-2" />
              Institutional Billing
            </span>
            <span className="flex items-center justify-center font-semibold text-gray-500">
              <ShieldPlus className="mr-2" />
              FERPA Compliant
            </span>
          </div>
        
        {/* Comparison Table */}
        <div className="mt-[70px] max-w-full bg-gray-100 p-8 rounded-lg">
          <h2 className="text-4xl font-semibold text-gray-800 text-center">Detailed Feature Comparison</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
            {/* Column 1 */}
            <div className="flex flex-col items-start justify-start space-y-10">
              <h2 className="text-xl text-gray-600">Core Features</h2>
              <p className="text-black">AI Processing Power</p>
              <p className="text-black">Academic Integrity Tools</p>
              <p className="text-black">Customizable Reporting</p>
              <p className="text-black">24/7 Customer Support</p>
              <p className="text-black">Integration with LMS</p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-start justify-start space-y-10">
              <h2 className="text-xl text-gray-600">Sholar</h2>
              <p className="text-black">Advanced Analytics</p>
              <p className="text-black">Priority Support</p>
              <p className="text-black">Custom Integrations</p>
              <p className="text-black">Dedicated Account Manager</p>
              <p className="text-black">Early Access to New Features</p>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-start justify-start space-y-10">
              <h2 className="text-xl text-green-500">Researcher</h2>
              <p className="text-green-600">Single Sign-On (SSO)</p>
              <p className="text-black">Advanced Security Measures</p>
              <p className="text-black">Dedicated Implementation Support</p>
              <p className="text-black">Custom Training Programs</p>
              <p className="text-black">White-labeling Options</p>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col items-start justify-start space-y-10">
              <h2 className="text-xl text-gray-600">Enterprise</h2>
              <p className="text-black">Custom Solutions</p>
              <p className="text-black font-semibold">Dedicated Resources</p>
              <p className="text-black">Priority Access</p>
              <p className="text-black font-semibold">Tailored Integrations</p>
              <p className="text-black font-semibold">Enhanced Support</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-[70px] relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-[url('/cta-img.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-800/40 to-black/40" />
          <div className="relative px-6 py-32 text-center">
            <h2 className="text-4xl font-semibold text-white">Ready to Elevate your Academic Journey?</h2>
            <p className="text-lg text-white/90 mt-4">
              Join thousands of satisfied users and experience the difference today.
            </p>
            <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
