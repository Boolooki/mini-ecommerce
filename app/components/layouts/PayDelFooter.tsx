// components/layout/PayDelFooter.tsx
export default function PayDelFooter() {
  return (
    <section className="bg-white text-gray-700 text-xs px-4 py-10 max-w-7xl mx-auto">
      <div className="flex gap-10 md:gap-20 justify-center flex-wrap">

        {/* 💳 Payment Methods */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-4">วิธีการชำระเงิน</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <img src="PaymentMethod1.png" alt="ชำระเงินปลายทาง (Cash on Delivery)" className="h-6" />
            <img src="PaymentMethod2.png" alt="VISA" className="h-6" />
            <img src="PaymentMethod3.png" alt="MasterCard" className="h-6" />
            <img src="PaymentMethod4.png" alt="JCB" className="h-6" />
          </div>
        </div>

        {/* 🚚 Delivery Services */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-4">บริการจัดส่ง</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <img src="DeliveryMethod1.png" alt="LEX Express" className="h-6" />
            <img src="DeliveryMethod3.png" alt="Flash Express" className="h-6" />
            <img src="DeliveryMethod5.png" alt="J&T Express" className="h-6" />
            <img src="DeliveryMethod2.png" alt="TP Logistics" className="h-6" />
            <img src="DeliveryMethod4.png" alt="Thailand Post" className="h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
