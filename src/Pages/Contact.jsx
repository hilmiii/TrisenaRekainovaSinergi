import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Send,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Contact() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block bg-teal-500/20 text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Hubungi Kami
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ada Pertanyaan Tentang <span className="text-teal-400">Furniture Laboratorium</span>?
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tim kami siap membantu konsultasi kebutuhan lemari asam, laminar air flow, 
              dan furniture laboratorium lainnya untuk laboratorium Anda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informasi Kontak
                </h2>
                <p className="text-gray-600">
                  Hubungi kami untuk konsultasi gratis mengenai kebutuhan furniture 
                  laboratorium Prosafeaire Anda.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Kantor & Workshop</h3>
                    <p className="text-gray-600">PT. Trisena Rekainova Sinergi</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Alamat</h3>
                    <p className="text-gray-600">
                      Jalan Raya Tapos No. 57<br />
                      Tapos, Kota Depok<br />
                      Jawa Barat, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telepon</h3>
                    <a href="tel:+6281298229897" className="text-teal-600 hover:underline">
                      +62 812 9822 9897
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href="mailto:marketing@lemari-asam.id" className="text-teal-600 hover:underline">
                      marketing@lemari-asam.id
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Jam Operasional</h3>
                    <p className="text-gray-600">
                      Senin - Jumat: 08:00 - 17:00<br />
                      Sabtu: 08:00 - 12:00
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Respon Lebih Cepat via WhatsApp
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Dapatkan konsultasi langsung dengan tim ahli kami
                </p>
                <a
                  href="https://wa.me/6281298229897?text=Halo,%20saya%20tertarik%20dengan%20produk%20furniture%20laboratorium%20Prosafeaire"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input id="phone" placeholder="081234567890" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Perusahaan / Institusi</Label>
                        <Input id="company" placeholder="PT. Example" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subjek</Label>
                      <Input id="subject" placeholder="Konsultasi Lemari Asam untuk Laboratorium Kimia" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tuliskan kebutuhan furniture laboratorium Anda dengan detail..."
                        className="min-h-[150px]"
                      />
                    </div>

                    <Button className="w-full bg-teal-600 hover:bg-teal-700 h-12">
                      <Send className="w-5 h-5 mr-2" />
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.6731728082744!2d106.85234707475385!3d-6.567499593427604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5f5e0b7c7f5%3A0x7c2a3c3b1c5c3c3c!2sJl.%20Raya%20Tapos%2C%20Tapos%2C%20Kec.%20Cimanggis%2C%20Kota%20Depok%2C%20Jawa%20Barat!5e0!3m2!1sen!2sid!4v1699999999999!5m2!1sen!2sid"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi PT. Trisena Rekainova Sinergi"
        />
      </section>
    </div>
  );
}