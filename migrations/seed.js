/**
 * SWD Furniture E-Commerce – Seed Data Migration
 * Run: node migrations/seed.js
 *
 * Seeds: Users, UserAddresses, Brands, Categories (hierarchical), Products, Reviews, Carts, Orders, Payments
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User        = require('../src/models/User');
const UserAddress = require('../src/models/UserAddress');
const Brand       = require('../src/models/Brand');
const Category    = require('../src/models/Category');
const Product     = require('../src/models/Product');
const Review      = require('../src/models/Review');
const Cart        = require('../src/models/Cart');
const Order       = require('../src/models/Order');
const Payment     = require('../src/models/Payment');

// ─── Helper ───────────────────────────────────────────────────────────────────
const hash = (pw) => bcrypt.hashSync(pw, 10);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB:', mongoose.connection.host);

    // ── Clear existing data ──────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      UserAddress.deleteMany({}),
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Payment.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing collections');

    // ── 1. Users ─────────────────────────────────────────────────────────────
    const users = await User.insertMany([
      {
        name: 'Super Admin',
        email: 'admin@furniture.com',
        password: hash('Admin@123'),
        phone: '0901000001',
        address: '1 Nguyen Hue, Q1, Ho Chi Minh City',
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Store Manager',
        email: 'manager@furniture.com',
        password: hash('Manager@123'),
        phone: '0901000002',
        address: '2 Le Loi, Q1, Ho Chi Minh City',
        role: 'manager',
        isActive: true,
      },
      {
        name: 'Nguyen Van An',
        email: 'an.nguyen@gmail.com',
        password: hash('Customer@123'),
        phone: '0901000003',
        address: '10 Tran Hung Dao, Q5, Ho Chi Minh City',
        role: 'customer',
        isActive: true,
      },
      {
        name: 'Tran Thi Bich',
        email: 'bich.tran@gmail.com',
        password: hash('Customer@123'),
        phone: '0901000004',
        address: '25 Pham Van Dong, Thu Duc, Ho Chi Minh City',
        role: 'customer',
        isActive: true,
      },
      {
        name: 'Le Minh Cuong',
        email: 'cuong.le@gmail.com',
        password: hash('Customer@123'),
        phone: '0901000005',
        address: '7 Vo Van Tan, Q3, Ho Chi Minh City',
        role: 'customer',
        isActive: true,
      },
      {
        name: 'Pham Thi Dung',
        email: 'dung.pham@gmail.com',
        password: hash('Customer@123'),
        phone: '0901000006',
        address: '55 Nguyen Trai, Q1, Ho Chi Minh City',
        role: 'customer',
        isActive: true,
        isGoogleAuth: true,
        googleId: 'google_uid_dung_001',
      },
    ]);
    console.log(`👥 Seeded ${users.length} users`);

    // ── 2. User Addresses ─────────────────────────────────────────────────────
    const customer1 = users[2]; // Nguyen Van An
    const customer2 = users[3]; // Tran Thi Bich
    const customer3 = users[4]; // Le Minh Cuong
    const customer4 = users[5]; // Pham Thi Dung
    const manager   = users[1];

    const userAddresses = await UserAddress.insertMany([
      {
        user: customer1._id,
        fullName: 'Nguyen Van An',
        phone: '0901000003',
        address: '10 Tran Hung Dao, Phuong 1',
        city: 'Ho Chi Minh City',
        province: 'Ho Chi Minh',
        isDefault: true,
      },
      {
        user: customer1._id,
        fullName: 'Nguyen Van An (Cơ quan)',
        phone: '0901000003',
        address: '123 Nguyen Van Troi, Phu Nhuan',
        city: 'Ho Chi Minh City',
        province: 'Ho Chi Minh',
        isDefault: false,
      },
      {
        user: customer2._id,
        fullName: 'Tran Thi Bich',
        phone: '0901000004',
        address: '25 Pham Van Dong, Linh Chieu',
        city: 'Ho Chi Minh City',
        province: 'Ho Chi Minh',
        isDefault: true,
      },
      {
        user: customer3._id,
        fullName: 'Le Minh Cuong',
        phone: '0901000005',
        address: '7 Vo Van Tan, Phuong 6',
        city: 'Ho Chi Minh City',
        province: 'Ho Chi Minh',
        isDefault: true,
      },
      {
        user: customer4._id,
        fullName: 'Pham Thi Dung',
        phone: '0901000006',
        address: '55 Nguyen Trai, Phuong Ben Thanh',
        city: 'Ho Chi Minh City',
        province: 'Ho Chi Minh',
        isDefault: true,
      },
    ]);
    console.log(`📍 Seeded ${userAddresses.length} user addresses`);

    // ── 3. Brands ─────────────────────────────────────────────────────────────
    const brands = await Brand.insertMany([
      {
        name: 'IKEA',
        description: 'Swedish multinational furniture brand known for ready-to-assemble furniture.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/200px-Ikea_logo.svg.png',
        website: 'https://www.ikea.com',
        isActive: true,
      },
      {
        name: 'Nội Thất Hòa Phát',
        description: 'Leading Vietnamese furniture manufacturer with 20+ years of experience.',
        logo: 'https://noithathoqaphat.com/logo.png',
        website: 'https://noithathoqaphat.com',
        isActive: true,
      },
      {
        name: 'Herman Miller',
        description: 'American furniture manufacturer specializing in office furniture and ergonomic chairs.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Herman_Miller_logo.svg/200px-Herman_Miller_logo.svg.png',
        website: 'https://www.hermanmiller.com',
        isActive: true,
      },
      {
        name: 'Vifon Home',
        description: 'Vietnamese furniture brand offering modern and affordable home solutions.',
        logo: 'https://vifonhome.vn/logo.png',
        website: 'https://vifonhome.vn',
        isActive: true,
      },
      {
        name: 'Kinnarps',
        description: 'Swedish office furniture brand, one of Europe\'s largest furniture manufacturers.',
        logo: 'https://kinnarps.com/logo.png',
        website: 'https://www.kinnarps.com',
        isActive: true,
      },
    ]);
    console.log(`🏷  Seeded ${brands.length} brands`);

    // ── 4. Categories (2-level hierarchy: Group → Sub-Category) ──────────────
    // Level 1: Top-level groups (parent = null) — UC-15: View Categories Group List
    const catGroups = await Category.insertMany([
      { name: 'Living Room', description: 'Furniture for living and sitting areas.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', parent: null, isActive: true },
      { name: 'Bedroom', description: 'Beds, wardrobes and bedroom accessories.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', parent: null, isActive: true },
      { name: 'Kitchen & Dining', description: 'Tables, chairs and storage for dining areas.', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400', parent: null, isActive: true },
      { name: 'Office', description: 'Office desks, chairs and storage solutions.', image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400', parent: null, isActive: true },
      { name: 'Outdoor', description: 'Garden and patio furniture.', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400', parent: null, isActive: true },
    ]);

    const [grpLiving, grpBedroom, grpDining, grpOffice, grpOutdoor] = catGroups;

    // Level 2: Sub-categories under each group — UC-17: View Categories List
    const catSubs = await Category.insertMany([
      // Living Room subs
      { name: 'Sofas & Couches',    description: '2, 3 and 4-seat sofas.',         parent: grpLiving._id,  isActive: true },
      { name: 'Armchairs',          description: 'Single accent and lounge chairs.',parent: grpLiving._id,  isActive: true },
      { name: 'Coffee Tables',      description: 'Low tables for living rooms.',    parent: grpLiving._id,  isActive: true },
      { name: 'TV Units',           description: 'Media consoles and TV stands.',   parent: grpLiving._id,  isActive: true },
      // Bedroom subs
      { name: 'Beds & Bed Frames',  description: 'Single, double and king beds.',   parent: grpBedroom._id, isActive: true },
      { name: 'Wardrobes',          description: 'Sliding and hinged wardrobes.',   parent: grpBedroom._id, isActive: true },
      { name: 'Bedside Tables',     description: 'Nightstands and bedside cabinets.',parent: grpBedroom._id,isActive: true },
      // Kitchen & Dining subs
      { name: 'Dining Tables',      description: 'Extendable and fixed dining tables.',parent: grpDining._id, isActive: true },
      { name: 'Dining Chairs',      description: 'Upholstered and wooden dining chairs.',parent: grpDining._id, isActive: true },
      // Office subs
      { name: 'Office Desks',       description: 'Standing, L-shaped and regular desks.',parent: grpOffice._id, isActive: true },
      { name: 'Office Chairs',      description: 'Ergonomic and task chairs.',       parent: grpOffice._id, isActive: true },
      // Outdoor subs
      { name: 'Garden Sets',        description: 'Patio table and chair sets.',      parent: grpOutdoor._id, isActive: true },
      { name: 'Outdoor Loungers',   description: 'Sun loungers and daybeds.',        parent: grpOutdoor._id, isActive: true },
    ]);

    const categories = [...catGroups, ...catSubs];
    console.log(`📦 Seeded ${catGroups.length} category groups + ${catSubs.length} sub-categories = ${categories.length} total`);

    // ── 5. Products ───────────────────────────────────────────────────────────
    // catSubs indices: [0]=Sofas, [1]=Armchairs, [2]=CoffeeTables, [3]=TVUnits,
    //                  [4]=Beds, [5]=Wardrobes, [6]=BedsideTables,
    //                  [7]=DiningTables, [8]=DiningChairs,
    //                  [9]=OfficeDesks, [10]=OfficeChairs,
    //                  [11]=GardenSets, [12]=OutdoorLoungers
    const products = await Product.insertMany([
      // Sofas
      {
        name: 'KIVIK 3-Seat Sofa',
        description: 'A generous sofa with a thick seat cushion and comfortable back cushions. Durable and easy to care for with removable, washable covers.',
        price: 8990000,
        discountPrice: 7990000,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600',
        ],
        stock: 15,
        category: catSubs[0]._id,
        brand: brands[0]._id,
        dimensions: { width: 228, height: 83, depth: 95 },
        material: 'Polyester fabric, solid hardwood frame',
        color: ['Beige', 'Grey', 'Dark Blue'],
        rating: 4.5,
        reviewCount: 0,
        isActive: true,
      },
      {
        name: 'Sofa Da Cao Cấp HP-101',
        description: 'Sofa da thật cao cấp nhập khẩu, khung gỗ tự nhiên, đệm mút cao su non, sang trọng và bền đẹp theo thời gian.',
        price: 15500000,
        discountPrice: 13900000,
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
        ],
        stock: 8,
        category: catSubs[0]._id,
        brand: brands[1]._id,
        dimensions: { width: 220, height: 85, depth: 92 },
        material: 'Da thật, khung gỗ sồi tự nhiên',
        color: ['Nâu', 'Đen', 'Kem'],
        rating: 4.7,
        reviewCount: 0,
        isActive: true,
      },
      // Beds
      {
        name: 'MALM Bed Frame with Storage',
        description: 'Clean design with storage underneath. Fits standard mattress sizes. Slatted bed base included for breathability.',
        price: 5490000,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600',
        ],
        stock: 20,
        category: catSubs[4]._id,
        brand: brands[0]._id,
        dimensions: { width: 160, height: 38, depth: 200 },
        material: 'Fibreboard, oak veneer',
        color: ['White', 'Oak', 'Black-Brown'],
        rating: 4.3,
        reviewCount: 0,
        isActive: true,
      },
      {
        name: 'Giường Ngủ Hòa Phát GN001',
        description: 'Giường ngủ gỗ công nghiệp cao cấp, đầu giường bọc da êm ái, hộc kéo tiện lợi. Phù hợp cho phòng ngủ hiện đại.',
        price: 6200000,
        discountPrice: 5500000,
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
        ],
        stock: 12,
        category: catSubs[4]._id,
        brand: brands[1]._id,
        dimensions: { width: 160, height: 45, depth: 200 },
        material: 'Gỗ MDF phủ veneer, đầu giường bọc da PU',
        color: ['Nâu gỗ', 'Trắng'],
        rating: 4.4,
        reviewCount: 0,
        isActive: true,
      },
      // Tables
      {
        name: 'EKEDALEN Extendable Table',
        description: 'Seats 4–6 people depending on the extension. The table top can be extended to accommodate more guests when needed.',
        price: 4990000,
        discountPrice: 4290000,
        images: [
          'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600',
        ],
        stock: 25,
        category: catSubs[7]._id,
        brand: brands[0]._id,
        dimensions: { width: 120, height: 75, depth: 80 },
        material: 'Solid birch, birch veneer',
        color: ['White', 'Dark Brown', 'Oak'],
        rating: 4.2,
        reviewCount: 0,
        isActive: true,
      },
      {
        name: 'Bàn Làm Việc Vifon VD-200',
        description: 'Bàn làm việc thiết kế tối giản, có ngăn kéo tiện dụng, chân thép sơn tĩnh điện chắc chắn, phù hợp văn phòng hoặc phòng học.',
        price: 2800000,
        discountPrice: 2490000,
        images: [
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
        ],
        stock: 30,
        category: catSubs[9]._id,
        brand: brands[3]._id,
        dimensions: { width: 120, height: 75, depth: 60 },
        material: 'Gỗ MDF chống ẩm, chân thép',
        color: ['Trắng', 'Đen', 'Nâu'],
        rating: 4.0,
        reviewCount: 0,
        isActive: true,
      },
      // Chairs
      {
        name: 'Herman Miller Aeron Chair',
        description: 'Iconic ergonomic office chair with patented PostureFit SL technology. Adjustable lumbar support, armrests and tilt tension. Built to last.',
        price: 28900000,
        discountPrice: 26500000,
        images: [
          'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
          'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600',
        ],
        stock: 6,
        category: catSubs[10]._id,
        brand: brands[2]._id,
        dimensions: { width: 67, height: 104, depth: 67 },
        material: '8Z Pellicle mesh, die-cast aluminum',
        color: ['Graphite', 'Carbon', 'Mineral'],
        rating: 4.9,
        reviewCount: 0,
        isActive: true,
      },
      {
        name: 'Ghế Văn Phòng Kinnarps Plus',
        description: 'Ghế công thái học cao cấp, lưng lưới thoáng khí, tay vịn 4D, có thể điều chỉnh độ cao, góc ngồi và độ nghiêng tựa lưng.',
        price: 12500000,
        discountPrice: 10900000,
        images: [
          'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600',
        ],
        stock: 10,
        category: catSubs[10]._id,
        brand: brands[4]._id,
        dimensions: { width: 65, height: 120, depth: 65 },
        material: 'Lưới polyester, khung nhôm',
        color: ['Đen', 'Xám'],
        rating: 4.6,
        reviewCount: 0,
        isActive: true,
      },
      // Wardrobes
      {
        name: 'PAX Wardrobe System',
        description: 'Customizable wardrobe system with different sizes, frames and doors. Interior organizers available separately.',
        price: 9800000,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        ],
        stock: 18,
        category: catSubs[5]._id,
        brand: brands[0]._id,
        dimensions: { width: 200, height: 236, depth: 60 },
        material: 'Particleboard, fibreboard, aluminium',
        color: ['White', 'Black-Brown'],
        rating: 4.4,
        reviewCount: 0,
        isActive: true,
      },
      // Outdoor
      {
        name: 'Bộ Bàn Ghế Sân Vườn Vifon OD-300',
        description: 'Bộ bàn ghế ngoài trời 4 ghế + 1 bàn, chất liệu mây tổng hợp không phai màu, chân nhôm chống rỉ sét, phù hợp ban công và sân vườn.',
        price: 7500000,
        discountPrice: 6800000,
        images: [
          'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600',
        ],
        stock: 14,
        category: catSubs[11]._id,
        brand: brands[3]._id,
        dimensions: { width: 120, height: 75, depth: 120 },
        material: 'Mây nhựa tổng hợp, khung nhôm',
        color: ['Nâu', 'Trắng kem'],
        rating: 4.3,
        reviewCount: 0,
        isActive: true,
      },
    ]);
    console.log(`🛋  Seeded ${products.length} products`);

    // ── 6. Reviews ────────────────────────────────────────────────────────────
    const reviews = await Review.insertMany([
      {
        user: customer1._id,
        product: products[0]._id,
        rating: 5,
        comment: 'Sofa rất đẹp và thoải mái, giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!',
        reply: {
          content: 'Cảm ơn quý khách đã tin tưởng và ủng hộ cửa hàng. Chúng tôi rất vui khi sản phẩm làm hài lòng quý khách!',
          repliedBy: manager._id,
          repliedAt: new Date('2026-02-20'),
        },
        isActive: true,
      },
      {
        user: customer2._id,
        product: products[0]._id,
        rating: 4,
        comment: 'Chất lượng tốt, màu sắc đúng như hình. Trừ 1 sao vì lắp ráp hơi phức tạp.',
        isActive: true,
      },
      {
        user: customer3._id,
        product: products[6]._id,
        rating: 5,
        comment: 'Ghế Herman Miller xứng đáng với giá tiền. Ngồi làm việc cả ngày không mỏi lưng. Tuyệt vời!',
        reply: {
          content: 'Cảm ơn bạn đã để lại đánh giá tích cực! Herman Miller luôn là sự lựa chọn hàng đầu cho dân văn phòng.',
          repliedBy: manager._id,
          repliedAt: new Date('2026-03-01'),
        },
        isActive: true,
      },
      {
        user: customer1._id,
        product: products[2]._id,
        rating: 4,
        comment: 'Giường đẹp, chắc chắn. Ngăn chứa đồ phía dưới rất tiện. Khuyên mọi người mua.',
        isActive: true,
      },
      {
        user: customer2._id,
        product: products[4]._id,
        rating: 4,
        comment: 'Bàn ăn vừa đủ cho gia đình 4 người, có thể kéo dài thêm khi cần. Gỗ chắc tay.',
        isActive: true,
      },
      {
        user: customer3._id,
        product: products[1]._id,
        rating: 5,
        comment: 'Sofa da Hòa Phát siêu đẹp, da mềm mại, nhìn sang trọng. Sẽ ủng hộ lần sau!',
        isActive: true,
      },
    ]);
    console.log(`⭐ Seeded ${reviews.length} reviews`);

    // Update product ratings
    const productRatingMap = {};
    reviews.forEach((r) => {
      const pid = r.product.toString();
      if (!productRatingMap[pid]) productRatingMap[pid] = [];
      productRatingMap[pid].push(r.rating);
    });
    for (const [pid, ratings] of Object.entries(productRatingMap)) {
      const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
      await Product.findByIdAndUpdate(pid, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: ratings.length,
      });
    }

    // ── 7. Carts ──────────────────────────────────────────────────────────────
    const carts = await Cart.insertMany([
      {
        user: customer1._id,
        items: [
          { product: products[5]._id, quantity: 1, price: products[5].discountPrice || products[5].price },
          { product: products[7]._id, quantity: 1, price: products[7].discountPrice || products[7].price },
        ],
        totalPrice: (products[5].discountPrice || products[5].price) + (products[7].discountPrice || products[7].price),
      },
      {
        user: customer2._id,
        items: [
          { product: products[8]._id, quantity: 1, price: products[8].price },
        ],
        totalPrice: products[8].price,
      },
    ]);
    console.log(`🛒 Seeded ${carts.length} carts`);

    // ── 8. Orders ─────────────────────────────────────────────────────────────
    // Note: insertMany does not trigger pre-save hooks, so orderNumber is set manually
    const orders = await Order.insertMany([
      {
        orderNumber: 'ORD-20260001',
        user: customer1._id,
        items: [
          {
            product: products[0]._id,
            productName: products[0].name,
            productImage: products[0].images[0],
            quantity: 1,
            price: products[0].discountPrice,
          },
          {
            product: products[4]._id,
            productName: products[4].name,
            productImage: products[4].images[0],
            quantity: 1,
            price: products[4].discountPrice,
          },
        ],
        totalPrice: products[0].discountPrice + products[4].discountPrice,
        shippingAddress: {
          fullName: 'Nguyen Van An',
          phone: '0901000003',
          address: '10 Tran Hung Dao',
          city: 'Ho Chi Minh City',
          userAddressRef: userAddresses[0]._id,
        },
        status: 'delivered',
        paymentMethod: 'vnpay',
        paymentStatus: 'paid',
        note: 'Giao giờ hành chính',
        createdAt: new Date('2026-01-15'),
      },
      {
        orderNumber: 'ORD-20260002',
        user: customer2._id,
        items: [
          {
            product: products[2]._id,
            productName: products[2].name,
            productImage: products[2].images[0],
            quantity: 1,
            price: products[2].price,
          },
        ],
        totalPrice: products[2].price,
        shippingAddress: {
          fullName: 'Tran Thi Bich',
          phone: '0901000004',
          address: '25 Pham Van Dong',
          city: 'Ho Chi Minh City',
          userAddressRef: userAddresses[2]._id,
        },
        status: 'shipping',
        paymentMethod: 'cod',
        paymentStatus: 'unpaid',
        createdAt: new Date('2026-02-10'),
      },
      {
        orderNumber: 'ORD-20260003',
        user: customer3._id,
        items: [
          {
            product: products[6]._id,
            productName: products[6].name,
            productImage: products[6].images[0],
            quantity: 1,
            price: products[6].discountPrice,
          },
        ],
        totalPrice: products[6].discountPrice,
        shippingAddress: {
          fullName: 'Le Minh Cuong',
          phone: '0901000005',
          address: '7 Vo Van Tan',
          city: 'Ho Chi Minh City',
          userAddressRef: userAddresses[3]._id,
        },
        status: 'delivered',
        paymentMethod: 'vnpay',
        paymentStatus: 'paid',
        createdAt: new Date('2026-02-20'),
      },
      {
        orderNumber: 'ORD-20260004',
        user: customer1._id,
        items: [
          {
            product: products[1]._id,
            productName: products[1].name,
            productImage: products[1].images[0],
            quantity: 1,
            price: products[1].discountPrice,
          },
        ],
        totalPrice: products[1].discountPrice,
        shippingAddress: {
          fullName: 'Nguyen Van An',
          phone: '0901000003',
          address: '10 Tran Hung Dao',
          city: 'Ho Chi Minh City',
          userAddressRef: userAddresses[0]._id,
        },
        status: 'confirmed',
        paymentMethod: 'vnpay',
        paymentStatus: 'paid',
        createdAt: new Date('2026-03-05'),
      },
      {
        orderNumber: 'ORD-20260005',
        user: customer2._id,
        items: [
          {
            product: products[9]._id,
            productName: products[9].name,
            productImage: products[9].images[0],
            quantity: 1,
            price: products[9].discountPrice,
          },
          {
            product: products[3]._id,
            productName: products[3].name,
            productImage: products[3].images[0],
            quantity: 1,
            price: products[3].discountPrice,
          },
        ],
        totalPrice: products[9].discountPrice + products[3].discountPrice,
        shippingAddress: {
          fullName: 'Tran Thi Bich',
          phone: '0901000004',
          address: '25 Pham Van Dong',
          city: 'Ho Chi Minh City',
          userAddressRef: userAddresses[2]._id,
        },
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'unpaid',
        createdAt: new Date('2026-03-10'),
      },
    ]);
    console.log(`📋 Seeded ${orders.length} orders`);

    // ── 9. Payments ───────────────────────────────────────────────────────────
    const payments = await Payment.insertMany([
      {
        order: orders[0]._id,
        user: customer1._id,
        amount: orders[0].totalPrice,
        method: 'vnpay',
        status: 'success',
        transactionId: 'VNP_TXN_20260115_001',
        createdAt: new Date('2026-01-15'),
      },
      {
        order: orders[2]._id,
        user: customer3._id,
        amount: orders[2].totalPrice,
        method: 'vnpay',
        status: 'success',
        transactionId: 'VNP_TXN_20260220_002',
        createdAt: new Date('2026-02-20'),
      },
      {
        order: orders[3]._id,
        user: customer1._id,
        amount: orders[3].totalPrice,
        method: 'vnpay',
        status: 'success',
        transactionId: 'VNP_TXN_20260305_003',
        createdAt: new Date('2026-03-05'),
      },
    ]);
    console.log(`💳 Seeded ${payments.length} payments`);

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n✅ Seeding completed successfully!');
    console.log('─────────────────────────────────────');
    console.log(`  Users          : ${users.length}  (1 admin, 1 manager, 4 customers)`);
    console.log(`  User Addresses : ${userAddresses.length}`);
    console.log(`  Brands         : ${brands.length}`);
    console.log(`  Categories     : ${categories.length}  (${catGroups.length} groups + ${catSubs.length} sub-categories)`);
    console.log(`  Products       : ${products.length}`);
    console.log(`  Reviews        : ${reviews.length}`);
    console.log(`  Carts          : ${carts.length}`);
    console.log(`  Orders         : ${orders.length}`);
    console.log(`  Payments       : ${payments.length}`);
    console.log('─────────────────────────────────────');
    console.log('\n📋 Test Credentials:');
    console.log('  Admin    : admin@furniture.com    / Admin@123');
    console.log('  Manager  : manager@furniture.com  / Manager@123');
    console.log('  Customer : an.nguyen@gmail.com    / Customer@123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
