// components/layout/SEOFooter.tsx
export default function SEOFooter() {
  return (
    <footer className="bg-white text-gray-600 text-xs px-4 py-10 leading-relaxed max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:gap-12">
        {/* 🧠 บทนำ */}
        <div className="flex-1 mb-6 md:mb-0">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Tripidok Mini-ecommerce: ประสบการณ์การช้อปปิ้งที่ดีที่สุด
          </h2>
          <p>
            เรามุ่งมั่นที่จะมอบประสบการณ์การช้อปปิ้งออนไลน์ที่สะดวก รวดเร็ว และปลอดภัย
            ด้วยระบบที่ออกแบบมาเพื่อผู้ใช้ทุกคน ไม่ว่าจะเป็นนักช้อปมือใหม่หรือผู้ขายมืออาชีพ
          </p>
        </div>

        {/* 🎯 ความหลากหลายของสินค้า */}
        <div className="flex-1 mb-6 md:mb-0">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            สินค้าหลากหลายหมวดหมู่
          </h3>
          <p>
            พบกับสินค้าหลากหลายหมวดหมู่ เช่น อิเล็กทรอนิกส์ แฟชั่น ของใช้ในบ้าน ความงาม และอาหาร
            ทุกหมวดหมู่ถูกจัดเรียงอย่างชัดเจนเพื่อให้คุณค้นหาได้ง่ายและรวดเร็ว
          </p>
        </div>

        {/* 🤝 ความร่วมมือกับแบรนด์ */}
        <div className="flex-1 mb-6 md:mb-0">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            ความร่วมมือกับแบรนด์ชั้นนำ
          </h3>
          <p>
            เราร่วมมือกับแบรนด์ชั้นนำทั้งในประเทศและต่างประเทศ เพื่อให้คุณมั่นใจในคุณภาพสินค้า
            พร้อมรับประกันความพึงพอใจและบริการหลังการขายที่เชื่อถือได้
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-12 mt-8">
        {/* 💳 การชำระเงินที่ปลอดภัย */}
        <div className="flex-1 mb-6 md:mb-0">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            ตัวเลือกการชำระเงินที่หลากหลาย
          </h3>
          <p>
            รองรับการชำระเงินผ่านบัตรเครดิต เดบิต โอนผ่านธนาคาร หรือเงินสดปลายทาง
            พร้อมระบบป้องกันข้อมูลและธุรกรรมที่ปลอดภัยระดับสูงสุด
          </p>
        </div>

        {/* 🚚 การจัดส่งทั่วประเทศ */}
        <div className="flex-1 mb-6 md:mb-0">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            การจัดส่งและคืนสินค้าที่ง่าย
          </h3>
          <p>
            เรามีบริการจัดส่งทั่วประเทศ พร้อมระบบติดตามสถานะ และขั้นตอนการคืนสินค้าที่ไม่ยุ่งยาก
            เพื่อให้คุณมั่นใจในทุกคำสั่งซื้อ
          </p>
        </div>

        {/* 🎉 โปรโมชั่นและดีลเด็ด */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            โปรโมชั่นสุดคุ้มทุกวัน
          </h3>
          <p>
            พบกับดีลเด็ด คูปองส่วนลด และแคมเปญพิเศษ เช่น Birthday Sale, Mid-Year Festival, 9.9, 11.11 และ 12.12
            ที่จัดขึ้นตลอดปีเพื่อให้คุณช้อปได้อย่างคุ้มค่า
          </p>
        </div>
      </div>

      <div className="mt-8">
        {/* 🌐 วิสัยทัศน์ของแพลตฟอร์ม */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          วิสัยทัศน์ของ Mini-ecommerce
        </h3>
        <p>
          เราเชื่อว่าการช้อปปิ้งออนไลน์ควรเป็นเรื่องง่าย สนุก และปลอดภัย
          ด้วยเทคโนโลยีที่ทันสมัยและการออกแบบที่เน้นผู้ใช้เป็นศูนย์กลาง
          Tripidok มุ่งมั่นที่จะเป็นแพลตฟอร์มที่ตอบโจทย์ทุกความต้องการของผู้ซื้อและผู้ขายในยุคดิจิทัล
        </p>
      </div>
    </footer>
  );
}
