import Link from 'next/link';

const MainFooter = () => {
    return (
        <footer className="bg-neutral-100 text-sm text-gray-700 border-t border-gray-300 py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* 🏬 หมวดหมู่สินค้า */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900">หมวดหมู่สินค้า</h3>
          <ul className="space-y-1">
            <li><Link href="/category/electronics">อิเล็กทรอนิกส์</Link></li>
            <li><Link href="/category/fashion">แฟชั่น</Link></li>
            <li><Link href="/category/home">ของใช้ในบ้าน</Link></li>
            <li><Link href="/category/beauty">ความงาม</Link></li>
          </ul>
        </div>

        {/* 📚 ข้อมูลบริษัท */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900">เกี่ยวกับเรา</h3>
          <ul className="space-y-1">
            <li><Link href="/about">ข้อมูลบริษัท</Link></li>
            <li><Link href="/contact">ติดต่อเรา</Link></li>
            <li><Link href="/careers">ร่วมงานกับเรา</Link></li>
            <li><Link href="/blog">บล็อก</Link></li>
          </ul>
        </div>

        {/* 📄 นโยบายและข้อกำหนด */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900">นโยบาย</h3>
          <ul className="space-y-1">
            <li><Link href="/terms">ข้อกำหนดการใช้งาน</Link></li>
            <li><Link href="/privacy">นโยบายความเป็นส่วนตัว</Link></li>
            <li><Link href="/returns">การคืนสินค้า</Link></li>
            <li><Link href="/shipping">การจัดส่ง</Link></li>
          </ul>
        </div>

        {/* 📱 ช่องทางติดตาม */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900">ติดตามเรา</h3>
          <ul className="space-y-1">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://line.me" target="_blank" rel="noopener noreferrer">LINE Official</a></li>
            <li><Link href="/app">ดาวน์โหลดแอป</Link></li>
          </ul>
        </div>
      </div>
    </footer>
    );
};

export default MainFooter;