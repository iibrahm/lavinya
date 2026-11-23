/**
 * LAVİNYA ECZANESİ - INTERACTIVE SCRIPT
 * Handles:
 * 1. Live Working Status & Duty Calculator (Istanbul Timezone UTC+3, Pzt-Cmt: 09:00 - 19:00, Pazar: Kapalı)
 * 2. Mobile Drawer Navigation
 * 3. Interactive Health Guide Tabs (Category switching)
 * 4. FAQ Accordion Logic with ARIA states
 * 5. Clipboard Copy for Phone & Address with Toast Notifications
 * 6. Quick WhatsApp Consultation Modal Composer (via 0553 953 35 34)
 * 7. Header Glassmorphic Scroll Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatusTracker();
  initHeaderScroll();
  initMobileNavigation();
  initHealthGuide();
  initFAQAccordion();
});

/* ==========================================================================
   1. LIVE STATUS & WORKING HOURS TRACKER (TURKEY / İSTANBUL LOCAL TIME)
   ========================================================================== */
function initLiveStatusTracker() {
  const liveHeader = document.getElementById('liveStatusHeader');
  const liveText = document.getElementById('liveStatusText');
  const heroLiveStatusVal = document.getElementById('heroLiveStatusVal');
  const heroLiveStatusSub = document.getElementById('heroLiveStatusSub');

  function calculateStatus() {
    // Current time in Istanbul / Turkey (UTC+3)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istanbulDate = new Date(utc + (3600000 * 3));

    const day = istanbulDate.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const hours = istanbulDate.getHours();
    const minutes = istanbulDate.getMinutes();
    const currentTotalMinutes = (hours * 60) + minutes;

    // Official Istanbul Pharmacy Hours (İEO / Google Maps):
    // Pazartesi - Cumartesi: 09:00 (540 mins) to 19:00 (1140 mins)
    // Pazar: Kapalı (Nöbet hariç)
    const openTime = 9 * 60;   // 09:00
    const closeTime = 19 * 60; // 19:00

    const isSunday = (day === 0);
    const isWorkingHours = !isSunday && (currentTotalMinutes >= openTime && currentTotalMinutes < closeTime);

    // Row highlights in table
    const rowWeekday = document.getElementById('rowWeekday');
    const rowSaturday = document.getElementById('rowSaturday');
    const rowSunday = document.getElementById('rowSunday');

    if (rowWeekday) rowWeekday.classList.remove('current-day');
    if (rowSaturday) rowSaturday.classList.remove('current-day');
    if (rowSunday) rowSunday.classList.remove('current-day');

    if (isSunday) {
      if (rowSunday) rowSunday.classList.add('current-day');
      
      if (liveText) liveText.textContent = 'Pazar • Kapalı (Nöbet Hariç)';
      if (liveHeader) {
        liveHeader.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        liveHeader.style.background = 'rgba(239, 68, 68, 0.12)';
        liveHeader.style.color = '#F87171';
      }
      if (heroLiveStatusVal) heroLiveStatusVal.textContent = 'Bugün Pazar: Kapalı';
      if (heroLiveStatusSub) heroLiveStatusSub.textContent = 'Yalnızca nöbetçi olunan pazar günlerinde 24 saat açıktır.';
    } else {
      if (day === 6) {
        if (rowSaturday) rowSaturday.classList.add('current-day');
      } else {
        if (rowWeekday) rowWeekday.classList.add('current-day');
      }

      if (isWorkingHours) {
        const remainingMinutes = closeTime - currentTotalMinutes;
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingMinsFormatted = remainingMinutes % 60;
        
        let closingHint = `Kapanışa ${remainingHours} saat ${remainingMinsFormatted} dk`;
        if (remainingHours === 0) {
          closingHint = `Kapanışa son ${remainingMinsFormatted} dakika`;
        }

        if (liveText) liveText.textContent = 'Şu an Açık • 19:00\'a kadar';
        if (liveHeader) {
          liveHeader.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          liveHeader.style.background = 'rgba(16, 185, 129, 0.15)';
          liveHeader.style.color = '#34D399';
        }
        if (heroLiveStatusVal) heroLiveStatusVal.textContent = 'Şu an Açık (09:00 - 19:00)';
        if (heroLiveStatusSub) heroLiveStatusSub.textContent = closingHint + ' • Akyaka Park Yemek Katı No: 7/332';
      } else {
        const isBeforeOpen = currentTotalMinutes < openTime;
        const msg = isBeforeOpen ? 'Kapalı • 09:00\'da Açılacak' : 'Mesai Bitti • Kapalı';

        if (liveText) liveText.textContent = msg;
        if (liveHeader) {
          liveHeader.style.borderColor = 'rgba(245, 158, 11, 0.4)';
          liveHeader.style.background = 'rgba(245, 158, 11, 0.15)';
          liveHeader.style.color = '#FBBF24';
        }
        if (heroLiveStatusVal) heroLiveStatusVal.textContent = isBeforeOpen ? 'Mesai Dışı (Açılış: 09:00)' : 'Mesai Bitti (Açılış: Yarın 09:00)';
        if (heroLiveStatusSub) heroLiveStatusSub.textContent = 'Nöbetçi eczane bilgisi için aşağıdaki İEO listesini inceleyiniz.';
      }
    }
  }

  calculateStatus();
  // Refresh every minute
  setInterval(calculateStatus, 60000);
}

/* ==========================================================================
   2. HEADER SCROLL GLASSMORPHISM TRIGGER
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    drawer.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE HEALTH & PHARMACIST GUIDE
   ========================================================================== */
const guideTopicsData = {
  ilac: {
    title: 'Akılcı İlaç Kullanımı & Güvenli Saklama İlkeleri',
    description: 'İlaçların terapötik etkinliğini kaybetmemesi ve toksik etkiler oluşturmaması için doğru koşullarda saklanması ve hekimin belirttiği disiplinle alınması şarttır.',
    tips: [
      {
        title: 'Buzdolabı vs. Oda Sıcaklığı Ayrımı',
        desc: 'Ambalajında "2-8°C" ibaresi bulunmayan ilaçlar buzdolabına konmamalıdır. Rutubetli banyo dolapları yerine nemsiz, 25°C altındaki kuru dolaplar tercih edilmelidir.'
      },
      {
        title: 'Antibiyotiklerde Saat ve Doz Disiplini',
        desc: 'Antibiyotikler "kendinizi iyi hissettiğinizde" kesilmemelidir. Doz aralıklarına (8 veya 12 saatte bir) sadık kalmak direnç gelişimini engeller.'
      },
      {
        title: 'Besin - İlaç Etkileşimlerine Dikkat',
        desc: 'Greyfurt suyu, süt ve süt ürünleri bazı antibiyotik ve tansiyon ilaçlarının emilimini bloke edebilir veya artırabilir. İlacınızı bol su ile alınız.'
      }
    ],
    sidebarTitle: 'İlaç Danışma',
    sidebarText: 'Kullandığınız ilaçların etkileşimi hakkında eczacımızla doğrudan görüşebilirsiniz.'
  },
  vitamin: {
    title: 'Vitamin & Mineral Takviyelerinin Akılcı Kullanımı',
    description: 'Takviye edici gıdalar ilaç değildir ancak rastgele kullanıldığında karaciğer ve böbrek metabolizmasını zorlayabilir. Kan tahlili doğrultusunda planlanmalıdır.',
    tips: [
      {
        title: 'D Vitamini & Yağda Çözünme Kuralı',
        desc: 'D vitamini yağda çözünen bir vitamindir. Aç karnına değil, zeytinyağlı veya sağlıklı yağ içeren bir öğünün hemen ardından alınmalıdır.'
      },
      {
        title: 'Magnezyum Formlarının Doğru Seçimi',
        desc: 'Uyku ve kas rahatlaması için Magnezyum Bisglisinat, zihinsel odaklanma için Malat veya Treonat, bağırsak tembelliği için Sitrat tercih edilir.'
      },
      {
        title: 'Demir Takviyeleri ve Çay/Kahve Aralığı',
        desc: 'Demir preparatları emilimin bozulmaması için çay, kahve veya süt ürünlerinden en az 2 saat önce veya sonra C vitamini ile tüketilmelidir.'
      }
    ],
    sidebarTitle: 'Takviye Rehberi',
    sidebarText: 'Eczacımıza kan tahlili hekim notlarınızı danışarak doğru formu seçebilirsiniz.'
  },
  cilt: {
    title: 'Dermokozmetik Cilt Bariyeri Koruma & SPF Bilinci',
    description: 'Cildin en dış katmanı olan stratum corneum bariyeri zayıfladığında hassasiyet, kuruluk ve akne oluşur. Koruyucu bakım temizlik, nem ve güneş korumasından geçer.',
    tips: [
      {
        title: '365 Gün Geniş Spektrumlu Güneş Koruması (SPF)',
        desc: 'UVA ışınları bulutlu havalarda ve cam arkasından bile cilde ulaşır. Foto-yaşlanma ve leke oluşumunu önlemek için kışın da SPF kullanımı önerilir.'
      },
      {
        title: 'Cilt Bariyerini Destekleyen İçerikler',
        desc: 'Seramid, Hyaluronik Asit, Niacinamide ve Centella Asiatica içeren dermokozmetik formülasyonlar bariyer onarımında hekimlerin öncelikli tercihidir.'
      },
      {
        title: 'Aşırı Peeling ve Asit Kullanımından Kaçınma',
        desc: 'Aynı rutinde birden fazla asidi (AHA/BHA/Retinol) birleştirmek bariyeri tahriş edebilir. Uygulama günleri bölünmelidir.'
      }
    ],
    sidebarTitle: 'Cilt Tipi Analizi',
    sidebarText: 'Akyaka Park eczanemizde cilt tipinize uygun dermokozmetik seçimini birlikte yapabiliriz.'
  },
  bebek: {
    title: 'Anne, Bebek & Çocuk Sağlığında Pediatrik Güvenlik',
    description: 'Yenidoğan ve bebeklerin cilt bariyeri yetişkinlere kıyasla %30 daha incedir. Kimyasal içeriklerden arındırılmış, pediatrik onaylı ürünler esastır.',
    tips: [
      {
        title: 'Pişik Önleme & Bariyer Kremler',
        desc: 'Çinko oksit içeren koruyucu kremler her alt değişiminde temiz ve kuru cilde ince bir tabaka halinde uygulanmalıdır.'
      },
      {
        title: 'Ateş Düşürücü Dozlaması Kiloya Göredir',
        desc: 'Çocuklarda parasetamol veya ibuprofen içeren şurupların dozu yaşa göre değil, bebeğin/çocuğun güncel vücut ağırlığına (kg) göre hesaplanır.'
      },
      {
        title: 'Emzirme Dönemi Anne Destekleri',
        desc: 'Anne sütünün kalitesini korumak için annenin hidrasyonu, probiyotik dengesi ve hekim onaylı omega-3 takviyesi büyük önem taşır.'
      }
    ],
    sidebarTitle: 'Pediatrik Danışma',
    sidebarText: 'Bebek sağlığı ve gelişim destekleri için eczacımızın önerilerine danışabilirsiniz.'
  },
  kronik: {
    title: 'Hipertansiyon, Diyabet & Kronik Sağlık İzlemi',
    description: 'Kronik rahatsızlıklarda tedavinin başarısı, düzenli ölçüm ve ilaçların eksiksiz kullanımı ile doğrudan ilişkilidir.',
    tips: [
      {
        title: 'Tansiyon Ölçümünde Altın Kurallar',
        desc: 'Ölçüm öncesi en az 5 dakika dinlenmeli; son 30 dakika içinde sigara, çay veya kahve tüketilmemiş olmalıdır. Manşon kol hizasında olmalıdır.'
      },
      {
        title: 'Raporlu İlaçların Bitiş Tarihi Takibi',
        desc: 'Kronik raporlu ilaçlarınızı rapor süresi bitmeden önce hekiminize yenileterek tedavi kesintilerinin önüne geçebilirsiniz.'
      },
      {
        title: 'Tuz ve Sıvı Tüketim Dengesi',
        desc: 'Hipertansiyon hastalarının günlük tuz tüketimini sınırlandırması ve hekimlerinin belirlediği sıvı hedefini karşılaması esastır.'
      }
    ],
    sidebarTitle: 'Ölçüm & Takip',
    sidebarText: 'Eczanemizde tansiyon kontrolünüzü gerçekleştirebilir ve takip kartınızı temin edebilirsiniz.'
  }
};

function initHealthGuide() {
  const tabBtns = document.querySelectorAll('.guide-tab-btn');
  const contentBox = document.getElementById('guideContentBox');
  if (!contentBox) return;

  function renderTopic(topicKey) {
    const data = guideTopicsData[topicKey];
    if (!data) return;

    contentBox.style.opacity = '0';

    setTimeout(() => {
      contentBox.innerHTML = `
        <div class="guide-card-inner">
          <div class="guide-card-content">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <ul class="guide-tips-list">
              ${data.tips.map(tip => `
                <li class="guide-tip-item">
                  <span class="tip-check">✓</span>
                  <div class="tip-text">
                    <strong>${tip.title}</strong>
                    <span>${tip.desc}</span>
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="guide-sidebar-card">
            <div class="guide-sidebar-icon">🌿</div>
            <h4 class="guide-sidebar-title">${data.sidebarTitle}</h4>
            <p class="guide-sidebar-text">${data.sidebarText}</p>
            <a href="https://wa.me/905539533534?text=Merhaba%20Lavinya%20Eczanesi%2C%20${encodeURIComponent(data.title)}%20konusunda%20dan%C4%B1%C5%9Fmak%20istiyorum." 
               target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-block">
              WhatsApp ile Eczacıya Sor (0553 953 35 34)
            </a>
          </div>
        </div>
      `;
      contentBox.style.opacity = '1';
    }, 150);
  }

  // Initial render with 'ilac'
  renderTopic('ilac');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const topic = btn.getAttribute('data-topic');
      renderTopic(topic);
    });
  });
}

/* ==========================================================================
   5. SIKÇA SORULAN SORULAR (FAQ ACCORDION)
   ========================================================================== */
function initFAQAccordion() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      // Close all items
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  const toastBox = document.getElementById('toastBox');
  const toastMsg = document.getElementById('toastMessage');
  if (!toastBox || !toastMsg) return;

  toastMsg.textContent = message;
  toastBox.classList.add('show');

  setTimeout(() => {
    toastBox.classList.remove('show');
  }, 3000);
}

window.copyPharmacyAddress = function() {
  const addressText = "İnkılap Mahallesi, Dr. Adnan Büyükdeniz Caddesi, No: 7/332 (Akyaka Park AVM Yemek Katı), Posta Kodu: 34768, Ümraniye / İstanbul";
  navigator.clipboard.writeText(addressText).then(() => {
    const btnText = document.getElementById('copyAddrBtnText');
    if (btnText) btnText.textContent = 'Kopyalandı!';
    showToast('✓ Adres panoya kopyalandı.');
    setTimeout(() => {
      if (btnText) btnText.textContent = 'Adresi Kopyala';
    }, 2500);
  }).catch(() => {
    showToast('Adres kopyalanamadı, lütfen manuel kopyalayınız.');
  });
};

window.copyPharmacyPhone = function() {
  const phones = "Sabit: 0 (216) 504 61 71 | Mobil & WhatsApp: 0 (553) 953 35 34";
  navigator.clipboard.writeText(phones).then(() => {
    const btnText = document.getElementById('copyPhoneBtnText');
    if (btnText) btnText.textContent = 'Kopyalandı!';
    showToast('✓ Telefon numaraları panoya kopyalandı: 0216 504 61 71 / 0553 953 35 34');
    setTimeout(() => {
      if (btnText) btnText.textContent = 'Numaraları Kopyala';
    }, 2500);
  }).catch(() => {
    showToast('Numara kopyalanamadı.');
  });
};

/* ==========================================================================
   7. CONSULTATION MODAL DIALOG & WHATSAPP SENDER
   ========================================================================== */
window.openConsultModal = function() {
  const modal = document.getElementById('consultModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeConsultModal = function() {
  const modal = document.getElementById('consultModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
  const modal = document.getElementById('consultModal');
  if (modal && e.target === modal) {
    window.closeConsultModal();
  }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeConsultModal();
  }
});

window.handleConsultSubmit = function(event) {
  event.preventDefault();
  const topic = document.getElementById('consultTopic').value;
  const message = document.getElementById('consultMessage').value.trim();

  let waText = `Merhaba Lavinya Eczanesi,\nKonu: ${topic}`;
  if (message) {
    waText += `\nMesajım: ${message}`;
  }

  // Uses mobile WhatsApp line 0553 953 35 34
  const encodedUrl = `https://wa.me/905539533534?text=${encodeURIComponent(waText)}`;
  window.open(encodedUrl, '_blank');
  window.closeConsultModal();
};
