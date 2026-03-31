import Link from 'next/link';

export const metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully.',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000' }}>
      <div className="max-w-lg text-center">
        <div className="text-6xl mb-6">?</div>
        <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
        <p className="text-gray-400 text-lg mb-2">
          Thank you for your purchase. Your order is being processed.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          You will receive a confirmation email with tracking information once your order ships.
        </p>
        <Link
          href="/store"
          className="inline-block px-8 py-3 bg-white text-black rounded font-bold text-lg hover:bg-gray-200 transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
