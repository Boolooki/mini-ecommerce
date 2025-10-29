import Link from 'next/link';

const MainFooter = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:text-gray-300">หน้าหลัก</Link></li>
                            <li><Link href="/products" className="hover:text-gray-300">สินค้าทั้งหมด</Link></li>
                            <li><Link href="/promotions" className="hover:text-gray-300">โปรโมชั่น</Link></li>
                        </ul>
                    </div>

                    {/* Categories Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">หมวดหมู่สินค้า</h3>
                        <ul className="space-y-2">
                            <li><Link href="/category/electronics" className="hover:text-gray-300">อิเล็กทรอนิกส์</Link></li>
                            <li><Link href="/category/fashion" className="hover:text-gray-300">แฟชั่น</Link></li>
                            <li><Link href="/category/home" className="hover:text-gray-300">บ้านและสวน</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">บริการลูกค้า</h3>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:text-gray-300">ติดต่อเรา</Link></li>
                            <li><Link href="/faq" className="hover:text-gray-300">คำถามที่พบบ่อย</Link></li>
                            <li><Link href="/shipping" className="hover:text-gray-300">การจัดส่ง</Link></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">ติดต่อเรา</h3>
                        <ul className="space-y-2">
                            <li>โทร: 02-xxx-xxxx</li>
                            <li>อีเมล: contact@example.com</li>
                            <li>ที่อยู่: กรุงเทพมหานคร</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;