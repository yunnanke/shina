(function () {
  'use strict';
  const root = document.getElementById('app');
  const KEY = 'shina-plus-demo-v1';
  const ADMIN_AUTH_KEY = 'shina-plus-admin-auth';
  const ADMIN_PASSWORD_KEY = 'shina-plus-admin-password';
  const ADMIN_PASSWORD = 'shina2026';
  const servicesSeed = [
    { id: 'season', name: 'Сезонная замена, 4 колеса', price: 2800, duration: 50, category: 'Комплексные работы' },
    { id: 'wheel', name: 'Снятие и установка колеса', price: 350, duration: 15, category: 'Работы с колесом' },
    { id: 'balance', name: 'Балансировка, 4 колеса', price: 1400, duration: 35, category: 'Работы с колесом' },
    { id: 'puncture', name: 'Ремонт прокола', price: 700, duration: 25, category: 'Ремонт' },
    { id: 'patch', name: 'Ремонт камеры / латка', price: 900, duration: 30, category: 'Ремонт' },
    { id: 'disk', name: 'Правка диска', price: 1800, duration: 45, category: 'Ремонт' },
    { id: 'storage', name: 'Хранение комплекта шин', price: 5000, duration: 15, category: 'Дополнительно' },
    { id: 'nitrogen', name: 'Подкачка азотом', price: 400, duration: 10, category: 'Дополнительно' },
    { id: 'tpms', name: 'Замена датчика TPMS', price: 1200, duration: 25, category: 'Дополнительно' },
    { id: 'runflat', name: 'Run-flat / низкий профиль', price: 800, duration: 20, category: 'Дополнительно' }
  ];
  const weekDays = [
    { id: 1, label: 'Пн', name: 'Понедельник' },
    { id: 2, label: 'Вт', name: 'Вторник' },
    { id: 3, label: 'Ср', name: 'Среда' },
    { id: 4, label: 'Чт', name: 'Четверг' },
    { id: 5, label: 'Пт', name: 'Пятница' },
    { id: 6, label: 'Сб', name: 'Суббота' },
    { id: 0, label: 'Вс', name: 'Воскресенье' }
  ];
  const demoNames = ['Александр Волков','Мария Соколова','Дмитрий Орлов','Екатерина Смирнова','Илья Морозов','Анна Кузнецова','Максим Лебедев','Ольга Павлова','Никита Фёдоров','Дарья Козлова','Артём Новиков','Полина Васильева','Сергей Попов','Виктория Михайлова','Павел Сидоров','Елена Белова','Роман Тихонов','Ирина Захарова','Кирилл Егоров','Алина Николаева','Михаил Андреев','Татьяна Макарова','Егор Киселёв','Софья Громова','Андрей Виноградов','Наталья Богданова','Денис Воробьёв','Юлия Фролова','Владимир Жуков','Ксения Савельева'];
  const cars = ['Kia Sportage','Toyota Camry','Volkswagen Tiguan','Hyundai Solaris','Skoda Octavia','BMW X3','Lada Vesta','Mazda CX-5','Renault Duster','Audi A4'];
  const statuses = ['confirmed','new','confirmed','arrived','progress','done','confirmed','new','confirmed','done'];
  const statusLabels = { new: 'Новая', confirmed: 'Подтверждена', arrived: 'Приехал', progress: 'В работе', done: 'Выполнена', cancelled: 'Отменена', noshow: 'Не приехал' };
  const dateOffset = function (n) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
  function seed() {
    const bookings = [];
    for (let i = 0; i < 30; i++) {
      const day = Math.floor(i / 7) - 1;
      const hour = 8 + (i % 8);
      const minute = i % 3 === 0 ? '00' : i % 3 === 1 ? '30' : '15';
      bookings.push({
        id: 'D' + String(1840 + i), date: dateOffset(day), time: String(hour).padStart(2, '0') + ':' + minute,
        name: demoNames[i], phone: '+7 (916) 555-' + String(10 + i).padStart(2, '0') + '-' + String(40 + i).padStart(2, '0'),
        car: cars[i % cars.length], wheel: 'R' + (15 + i % 7), service: i % 3 === 0 ? 'Сезонная замена, балансировка' : i % 3 === 1 ? 'Сезонная замена, 4 колеса' : 'Ремонт прокола',
        price: 2800 + (i % 4) * 350, duration: i % 3 === 0 ? 65 : 50, post: i % 3 + 1, status: statuses[i % statuses.length], source: i % 4 === 0 ? 'Онлайн' : 'Телефон', note: '', token: Math.random().toString(36).slice(2, 14)
      });
    }
    return { services: servicesSeed, bookings: bookings, hours: { open: '08:00', close: '21:00', daysOff: [0] }, settings: { shopName: 'ШИНА+ на Соколе', address: 'Москва, Ленинградский проспект, 72', phone: '+7 (495) 120-45-60', autoConfirm: true, buffer: 10, cancelLimit: 2 }, posts: 3, waitlist: [] };
  }
  function loadData() {
    try { const saved = localStorage.getItem(KEY); if (saved) { const parsed = JSON.parse(saved); if (parsed && parsed.bookings && parsed.services) return parsed; } } catch (e) {}
    const fresh = seed(); saveData(fresh); return fresh;
  }
  function hasAdminAccess() { try { return localStorage.getItem(ADMIN_AUTH_KEY) === 'true'; } catch (e) { return false; } }
  function getAdminPassword() { try { return localStorage.getItem(ADMIN_PASSWORD_KEY) || ADMIN_PASSWORD; } catch (e) { return ADMIN_PASSWORD; } }
  let data = loadData();
  function saveData() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
  let page = hasAdminAccess() ? 'admin' : 'client', adminTab = 'overview', selectedDate = dateOffset(0), bookingFilter = 'all', bookingStep = 1, adminTapCount = 0, adminTapTimer = null, bookingDraft = { services: [], date: '', time: '', carType: 'Легковой', diameter: 'R16', carModel: '', extras: [] }, installPrompt = null;
  const rub = function (n) { return new Intl.NumberFormat('ru-RU').format(n) + ' ₽'; };
  const dateRu = function (d, options) { return new Intl.DateTimeFormat('ru-RU', options || { day: 'numeric', month: 'long' }).format(new Date(d + 'T12:00:00')); };
  const fullDate = function (d) { return new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d + 'T12:00:00')); };
  const esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  const getService = function (id) { return data.services.find(function (s) { return s.id === id; }); };
  const pickedServices = function () { return bookingDraft.services.map(getService).filter(Boolean); };
  const draftPrice = function () { return pickedServices().reduce(function (sum, s) { return sum + Number(s.price); }, 0) + bookingDraft.extras.reduce(function (sum, s) { return sum + s.price; }, 0) + (bookingDraft.diameter === 'R19' || bookingDraft.diameter === 'R20' || bookingDraft.diameter === 'R21' || bookingDraft.diameter === 'R22' ? 500 : 0); };
  const draftDuration = function () { return pickedServices().reduce(function (sum, s) { return sum + Number(s.duration); }, 0); };
  function showToast(message) { let el = document.querySelector('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); } el.textContent = message; el.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(function () { el.classList.remove('show'); }, 2800); }
  function dayName(i) { return ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][i]; }
  function timeToMin(time) { const p = time.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function dateString(date) { return date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0'); }
  function availableSlots(day, duration, excludeId) {
    const d = new Date(day + 'T12:00:00');
    if (data.hours.daysOff.indexOf(d.getDay()) !== -1) return [];
    const start = timeToMin(data.hours.open), close = timeToMin(data.hours.close);
    const step = 30, found = [];
    for (let t = start; t + duration <= close; t += step) {
      const time = String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
      let openPost = 0;
      for (let post = 1; post <= data.posts; post++) {
        const collision = data.bookings.some(function (b) {
          if (b.id === excludeId || b.date !== day || b.post !== post || ['cancelled','noshow'].indexOf(b.status) !== -1) return false;
          const a = timeToMin(b.time), bEnd = a + Number(b.duration || 50) + Number(data.settings.buffer || 0);
          return t < bEnd && t + duration > a;
        });
        if (!collision) { openPost = post; break; }
      }
      if (openPost) found.push({ time: time, post: openPost });
    }
    return found;
  }
  function slotsForDate(day) { return availableSlots(day, Math.max(20, draftDuration() || 50)); }
  function isOpen() { const now = new Date(); const mins = now.getHours() * 60 + now.getMinutes(); return data.hours.daysOff.indexOf(now.getDay()) === -1 && mins >= timeToMin(data.hours.open) && mins < timeToMin(data.hours.close); }
  function openTimeText() { const now=new Date();if(data.hours.daysOff.indexOf(now.getDay())!==-1)return 'Сегодня выходной';return isOpen()?'Открыто сейчас':'Сегодня работаем '+data.hours.open+'—'+data.hours.close; }
  function publicHoursRows() {
    const today = new Date().getDay();
    return weekDays.map(function(day) {
      const off = data.hours.daysOff.includes(day.id);
      return '<div class="hours-row"><span>' + day.name + (today === day.id ? ' · сегодня' : '') + '</span><strong>' + (off ? 'Выходной' : esc(data.hours.open) + ' — ' + esc(data.hours.close)) + '</strong></div>';
    }).join('');
  }
  function serviceTile(s) { return '<article class="service-card"><h3>' + esc(s.name) + '</h3><div class="service-meta"><span>' + s.duration + ' мин</span><strong>от ' + rub(s.price) + '</strong></div></article>'; }
  function slotsPreview() {
    let html = '';
    for (let i = 0; i < 4; i++) {
      const day = dateOffset(i), times = availableSlots(day, 50);
      if (times.length) html += '<button class="slot" data-slot-date="' + day + '" data-slot-time="' + times[0].time + '"><span>' + dateRu(day, { weekday:'short', day:'numeric', month:'short' }) + '</span><strong>' + times[0].time + '</strong><span>Есть окна · от ' + rub(servicesSeed[0].price) + '</span></button>';
    }
    if (!html) html = '<div class="empty-state">Свободных окон пока нет. Позвоните нам — найдём решение.</div>';
    return html;
  }
  function renderClient() {
    page = 'client'; document.body.className = '';
    const open = isOpen();
    root.innerHTML = '<div class="client-page">' +
      '<header class="client-nav"><a class="brand" href="#" aria-label="ШИНА+" data-action="secret-admin">ШИНА<span class="plus">+</span></a><div class="nav-right"><a class="nav-link" href="#services">Услуги</a><a class="nav-link" href="#address">Контакты</a><button class="nav-cta" data-action="open-booking">Записаться <span>↗︎</span></button></div></header>' +
      '<main><section class="hero"><div class="eyebrow"><i class="live-dot"></i>' + (open ? 'ОТКРЫТО СЕЙЧАС' : esc(openTimeText().toUpperCase())) + ' · МОСКВА, СОКОЛ</div><h1>ШИНО<br>МОНТАЖ<br><span class="hand">без очередей</span></h1><div class="tape">Мастерская у метро Сокол</div><div class="hero-bottom"><p class="hero-note">Переобуем, отбалансируем и проверим колёса. Выберите удобное время — мастер уже будет ждать.</p><div class="hero-aside"><span>Запись занимает<br>около минуты</span><button class="btn-black" data-action="open-booking">Выбрать время <b>↗︎</b></button></div></div></section>' +
      '<section class="editorial-section" id="services"><div class="section-head"><div><div class="micro">01 / РАБОТАЕМ С КОЛЁСАМИ</div><h2>Услуги<br>и цены</h2></div><div class="section-id">ПРАЙС</div></div><div class="service-grid">' + data.services.slice(0, 6).map(serviceTile).join('') + '</div><p class="legal" style="margin-top:16px">Итоговая стоимость зависит от диаметра колёс и типа автомобиля. Мастер подтвердит цену на месте.</p></section>' +
      '<section class="slot-wrap"><div class="slot-inner"><div class="section-head"><div><div class="micro slot-label">02 / БЛИЖАЙШАЯ ЗАПИСЬ</div><h2>Свободные<br>окна</h2></div><button class="btn-black" data-action="open-booking">Все даты <b>↗︎</b></button></div><div class="slot-grid">' + slotsPreview() + '</div></div></section>' +
      '<section class="editorial-section"><div class="section-head"><div><div class="micro">03 / БЕЗ ЛИШНИХ ЗВОНКОВ</div><h2>Как это<br>работает</h2></div></div><div class="how-grid"><article class="how-card"><div class="how-number">01</div><h3>Выбираете работу</h3><p>Отметьте нужные услуги и параметры колёс. Покажем ориентир по цене и времени.</p></article><article class="how-card"><div class="how-number">02</div><h3>Бронируете окно</h3><p>Укажите удобный день и оставьте номер. Никакой регистрации и лишних форм.</p></article><article class="how-card"><div class="how-number">03</div><h3>Приезжаете к сроку</h3><p>Пришлём подтверждение и напоминание. Оплата — после работы в мастерской.</p></article></div></section>' +
      '<section class="editorial-section" id="address"><div class="section-head"><div><div class="micro">04 / ЖДЁМ ВАС</div><h2>Адрес и<br>часы работы</h2></div><div class="section-id"><i class="live-dot"></i> ' + esc(openTimeText().toUpperCase()) + '</div></div><div class="address-grid"><div><div class="address-card"><div class="micro">МАСТЕРСКАЯ</div><h3>' + esc(data.settings.shopName) + '</h3><p>' + esc(data.settings.address) + '<br>5 минут пешком от метро Сокол<br>Заезд со стороны двора, парковка перед боксами.</p><div style="display:flex;gap:9px;flex-wrap:wrap"><a class="btn-black" target="_blank" rel="noreferrer" href="https://yandex.ru/maps/?text=' + encodeURIComponent(data.settings.address) + '">Построить маршрут ↗︎</a><a class="btn-light" href="tel:' + esc(data.settings.phone.replace(/[^+\d]/g,'')) + '">Позвонить</a></div></div>'+publicHoursRows()+'</div><div class="map-placeholder" role="img" aria-label="Карта расположения мастерской"><div class="map-pin"><span>+</span></div></div></div></section></main>' +
      '<footer class="client-footer"><div><div class="micro">ЗАПИСЫВАЙТЕСЬ УДОБНО</div><div class="footer-logo">ШИНА<span style="color:#e5201b">+</span></div></div><div class="footer-meta">' + esc(data.settings.address) + '<br><a href="tel:' + esc(data.settings.phone.replace(/[^+\d]/g,'')) + '">' + esc(data.settings.phone) + '</a><br>© 2026 · ШИНА+</div></footer>' +
      '<div class="mobile-sticky"><button class="btn-black" data-action="open-booking">Записаться на шиномонтаж <b>↗︎</b></button></div></div>';
    if ('serviceWorker' in navigator && !sessionStorage.getItem('shina-install-seen')) {
      setTimeout(function () { if (page === 'client' && window.matchMedia('(display-mode: standalone)').matches === false) showInstallHint(); }, 12000);
    }
  }
  function showInstallHint() {
    if (document.querySelector('.install-banner')) return;
    const box = document.createElement('div'); box.className = 'install-banner'; box.innerHTML = '<span>Сохраните ШИНА+ на экран телефона</span><button data-action="install-app">Добавить</button><button class="dismiss" data-action="dismiss-install" aria-label="Закрыть">×</button>';
    document.body.appendChild(box); sessionStorage.setItem('shina-install-seen', '1');
  }
  function statusPill(status) { return '<span class="status-pill status-' + status + '">' + esc(statusLabels[status] || status) + '</span>'; }
  function bookingRows(list, actions) {
    if (!list.length) return '<div class="empty-state">На этот день записей нет. Можно добавить визит вручную.</div>';
    return '<div class="booking-list">' + list.slice().sort(function (a,b) { return a.time.localeCompare(b.time); }).map(function (b) {
      return '<div class="booking-row" data-booking="' + esc(b.id) + '"><div class="booking-time">' + esc(b.time) + '</div><div class="booking-bar" style="background:' + (b.status === 'new' ? '#f6cb72' : b.status === 'done' ? '#777' : 'var(--red)') + '"></div><div class="booking-info"><strong>' + esc(b.name) + ' · ' + esc(b.car) + '</strong><small>' + esc(b.service) + ' · ' + esc(b.wheel) + ' · Пост ' + b.post + '</small></div>' + statusPill(b.status) + '</div>' + (actions ? '<div class="row-actions" data-actions-for="' + esc(b.id) + '">' + actionButtons(b) + '</div>' : '');
    }).join('') + '</div>';
  }
  function actionButtons(b) {
    if (['cancelled','done','noshow'].indexOf(b.status) !== -1) return '<button class="small-action" data-action="edit-booking" data-id="' + esc(b.id) + '">Открыть</button>';
    return (b.status === 'new' ? '<button class="small-action" data-action="status" data-id="' + esc(b.id) + '" data-status="confirmed">Подтвердить</button>' : '') +
      (b.status === 'confirmed' ? '<button class="small-action" data-action="status" data-id="' + esc(b.id) + '" data-status="arrived">Приехал</button>' : '') +
      (b.status === 'arrived' ? '<button class="small-action" data-action="status" data-id="' + esc(b.id) + '" data-status="progress">В работу</button>' : '') +
      (b.status === 'progress' ? '<button class="small-action" data-action="status" data-id="' + esc(b.id) + '" data-status="done">Завершить</button>' : '') +
      '<button class="small-action" data-action="edit-booking" data-id="' + esc(b.id) + '">Перенести</button>' +
      '<button class="small-action danger" data-action="status" data-id="' + esc(b.id) + '" data-status="cancelled">Отменить</button>';
  }
  function dayNamesHeader() { return ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(function(x){return '<span>'+x+'</span>';}).join(''); }
  function miniCalendar() {
    const today = new Date(); const year = today.getFullYear(), month = today.getMonth(); const first = new Date(year, month, 1); let offset = (first.getDay() + 6) % 7; let html = '<div class="mini-calendar">' + dayNamesHeader();
    for (let i = 0; i < offset; i++) html += '<span></span>';
    const count = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= count; day++) {
      const iso = dateString(new Date(year, month, day)); const classes = ['mini-day'];
      if (iso === dateOffset(0)) classes.push('today'); if (data.bookings.some(function(b){return b.date===iso && b.status!=='cancelled';})) classes.push('has-booking');
      html += '<button class="' + classes.join(' ') + '" data-action="select-date" data-date="' + iso + '">' + day + '</button>';
    }
    return html + '</div>';
  }
  function metric(label, value, sub, trend) { return '<div class="metric"><div class="metric-label"><span>' + label + '</span><span>' + (trend || '') + '</span></div><div class="metric-value">' + value + ' <em>' + (sub || '') + '</em></div></div>'; }
  function renderOverview() {
    const todays = data.bookings.filter(function(b){return b.date===selectedDate && !['cancelled','noshow'].includes(b.status);});
    const next = todays.filter(function(b){return timeToMin(b.time)>=new Date().getHours()*60+new Date().getMinutes();});
    const confirmed = todays.filter(function(b){return b.status==='confirmed'||b.status==='arrived'||b.status==='progress'||b.status==='done';}).length;
    const pending = data.bookings.filter(function(b){return b.status==='new';}).length;
    const earned = data.bookings.filter(function(b){return b.date===selectedDate&&b.status==='done';}).reduce(function(n,b){return n+b.price;},0);
    const util = Math.min(100, Math.round(todays.length / Math.max(1,data.posts*12)*100));
    const attention = data.bookings.filter(function(b){return b.date===selectedDate&&b.status==='new';});
    return '<div class="admin-cards">' + metric('Записи сегодня', todays.length, 'визитов', '<span class="metric-trend">↗︎ сезон</span>') + metric('Ждут подтверждения', pending, 'всего', pending ? '<span style="color:var(--amber)">● внимание</span>' : '') + metric('Загрузка постов', util, '%', '<span>из ' + data.posts + ' постов</span>') + metric('Выручка сегодня', rub(earned), '', '<span>по выполненным</span>') + '</div>' +
      '<div class="admin-grid"><section class="panel"><div class="panel-head"><div><h2>Сегодня · ' + esc(dateRu(selectedDate,{day:'numeric',month:'long'})) + '</h2><p>' + todays.length + ' записей · ' + data.posts + ' поста</p></div><button class="panel-action" data-action="go-tab" data-tab="bookings">Все записи ↗︎</button></div>' + bookingRows(todays.slice(0,6), false) + (todays.length > 6 ? '<button class="panel-action" style="margin-top:14px" data-action="go-tab" data-tab="bookings">Показать ещё ' + (todays.length-6) + ' ↗︎</button>' : '') + '</section>' +
      '<div><section class="panel mini-panel"><div class="panel-head"><div><h2>Календарь</h2><p>' + new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(new Date()) + '</p></div></div>' + miniCalendar() + '</section><section class="panel" style="margin-top:13px"><div class="panel-head"><div><h2>Загрузка сегодня</h2><p>по всем рабочим постам</p></div></div><div class="util-label"><span>Посты заняты</span><strong>' + util + '%</strong></div><div class="util-bar"><span style="width:' + util + '%"></span></div><div class="util-label"><span>Записано машин</span><strong>' + todays.length + ' / ' + data.posts*12 + '</strong></div></section>' + (attention.length ? '<div class="alert-card"><strong>' + attention.length + ' новых заявок ждут ответа</strong><p>Откройте список записей и подтвердите удобное время.</p></div>' : '') + '</div></div>';
  }
  function renderBookings() {
    const list = data.bookings.filter(function(b){return b.date===selectedDate&&(bookingFilter==='all'||b.status===bookingFilter);});
    const filters = [['all','Все записи'],['new','Новые'],['confirmed','Подтверждены'],['cancelled','Отменены']];
    return '<div class="admin-toolbar"><div class="segmented">' + filters.map(function(filter){return '<button class="' + (bookingFilter===filter[0]?'active':'') + '" data-action="filter-status" data-status="' + filter[0] + '">' + filter[1] + '</button>';}).join('') + '</div><button class="top-button" data-action="add-booking">＋ Добавить запись</button></div><section class="panel"><div class="panel-head"><div><h2>' + esc(fullDate(selectedDate)) + '</h2><p>' + list.length + ' записей</p></div><input class="filter-select" type="date" value="' + selectedDate + '" data-change="date-filter" aria-label="Выбрать дату"></div>' + bookingRows(list, true) + '</section>';
  }
  function renderSchedule() {
    let html = '<div class="admin-toolbar"><div class="segmented"><button class="active">День</button><button data-action="calendar-view">Неделя</button></div><input class="filter-select" type="date" value="' + selectedDate + '" data-change="date-filter" aria-label="Выбрать дату"><button class="top-button" data-action="add-booking">＋ Добавить визит</button></div><div class="full-calendar"><div class="calendar-grid"><div class="cal-cell cal-head">ВРЕМЯ</div>';
    for (let post=1;post<=data.posts;post++) html += '<div class="cal-cell cal-head">ПОСТ ' + post + '</div>';
    for (let hour=8;hour<21;hour++) {
      html += '<div class="cal-cell cal-time">' + String(hour).padStart(2,'0') + ':00</div>';
      for (let post=1;post<=data.posts;post++) {
        const at = data.bookings.filter(function(b){return b.date===selectedDate&&b.post===post&&Number(b.time.split(':')[0])===hour&&!['cancelled','noshow'].includes(b.status);});
        html += '<div class="cal-cell">' + at.map(function(b){return '<div class="booking-block ' + (b.status==='confirmed'?'confirmed':b.status==='done'?'done':'') + '" data-action="edit-booking" data-id="' + esc(b.id) + '"><strong>' + esc(b.time) + ' · ' + esc(b.name.split(' ')[0]) + '</strong>' + esc(b.service) + '</div>';}).join('') + '</div>';
      }
    }
    html += '</div></div><p class="legal" style="color:#888;font-size:10px">Демо-расписание показывает визиты по постам. Для переноса нажмите на запись.</p>';
    return html;
  }
  function renderClients() {
    const seen = {};
    data.bookings.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).forEach(function(b){ if (!seen[b.phone]) seen[b.phone] = b; });
    const rows = Object.keys(seen).map(function(phone){const b=seen[phone];return '<tr><td><strong>'+esc(b.name)+'</strong><br><span style="color:#999">'+esc(phone)+'</span></td><td>'+esc(b.car)+' · '+esc(b.wheel)+'</td><td>'+esc(dateRu(b.date))+'</td><td>'+esc(b.service)+'</td><td>'+data.bookings.filter(function(x){return x.phone===phone;}).length+'</td></tr>';}).join('');
    return '<section class="panel"><div class="panel-head"><div><h2>Клиентская база</h2><p>'+Object.keys(seen).length+' клиентов в демо-данных</p></div><input id="client-search" class="filter-select" placeholder="Поиск по имени или телефону"></div><div class="table-wrap"><table class="admin-table" id="clients-table"><thead><tr><th>Клиент</th><th>Автомобиль</th><th>Последний визит</th><th>Услуга</th><th>Визиты</th></tr></thead><tbody>'+rows+'</tbody></table></div></section>';
  }
  function renderSettings() {
    return '<div class="admin-section"><section class="panel"><div class="panel-head"><div><h2>Мастерская и расписание</h2><p>Эти данные показываются клиентам на публичной странице</p></div></div><div class="settings-grid"><div class="setting-field"><label>Название</label><input data-setting="shopName" value="'+esc(data.settings.shopName)+'"></div><div class="setting-field"><label>Адрес</label><input data-setting="address" value="'+esc(data.settings.address)+'"></div><div class="setting-field"><label>Телефон</label><input data-setting="phone" value="'+esc(data.settings.phone)+'"></div><div class="setting-field"><label>Количество постов</label><input data-setting="posts" type="number" min="1" max="12" value="'+data.posts+'"></div><div class="setting-field"><label>Начало работы</label><input data-setting="open" type="time" value="'+esc(data.hours.open)+'"></div><div class="setting-field"><label>Окончание работы</label><input data-setting="close" type="time" value="'+esc(data.hours.close)+'"></div><div class="setting-field"><label>Буфер между машинами, мин</label><input data-setting="buffer" type="number" min="0" max="60" value="'+data.settings.buffer+'"></div><div class="setting-field"><label>Подтверждение записей</label><select data-setting="autoConfirm"><option value="true" '+(data.settings.autoConfirm?'selected':'')+'>Автоматически</option><option value="false" '+(!data.settings.autoConfirm?'selected':'')+'>Вручную</option></select></div></div><div class="days-off-title">Выходные дни</div><div class="days-off-grid">'+weekDays.map(function(day){return '<label class="day-off-option"><input type="checkbox" data-dayoff="'+day.id+'" '+(data.hours.daysOff.includes(day.id)?'checked':'')+'><span>'+day.label+'</span></label>';}).join('')+'</div><button class="top-button settings-save-button" style="margin-top:17px" data-action="save-settings">Сохранить</button></section>' +
      '<section class="panel"><div class="panel-head"><div><h2>Услуги и ориентировочные цены</h2><p>Демо-прайс. Итоговая цена подтверждается в мастерской.</p></div></div>'+data.services.map(function(s){return '<div class="service-setting-row"><span>'+esc(s.name)+'</span><input type="number" data-service-price="'+esc(s.id)+'" value="'+Number(s.price)+'" aria-label="Цена '+esc(s.name)+'"><span>₽ · '+s.duration+' мин</span><span></span></div>';}).join('')+'<button class="top-button settings-save-button" style="margin-top:16px" data-action="save-prices">Сохранить</button></section>' +
      '<section class="panel"><div class="panel-head"><div><h2>Демо-режим</h2><p>Все изменения сохраняются только в этом браузере.</p></div></div><button class="small-action danger" data-action="reset-demo">Сбросить демо-данные</button><button class="small-action" style="margin-left:8px" data-action="go-client">Открыть клиентскую страницу</button></section><section class="panel"><div class="panel-head"><div><h2>Сменить пароль</h2><p>Изменение пароля для входа в кабинет</p></div></div><div class="settings-grid"><div class="setting-field"><label for="old-admin-password">Старый пароль</label><input id="old-admin-password" type="password" autocomplete="current-password" placeholder="Введите старый пароль"></div><div class="setting-field"><label for="new-admin-password">Новый пароль</label><input id="new-admin-password" type="password" autocomplete="new-password" placeholder="Не менее 6 символов"></div><div class="setting-field"><label for="repeat-admin-password">Повторите новый пароль</label><input id="repeat-admin-password" type="password" autocomplete="new-password" placeholder="Повторите новый пароль"></div></div><p id="password-change-message" class="password-change-message hidden" aria-live="polite"></p><button class="top-button settings-save-button" style="margin-top:14px" data-action="change-admin-password">Сохранить</button></section></div>';
  }
  function renderAdmin() {
    page = 'admin'; document.body.className = 'admin-body';
    const nav = [['overview','◫','Обзор'],['bookings','▤','Записи'],['schedule','▦','Расписание'],['clients','◎','Клиенты'],['settings','<svg class="gear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.09-.03a1.7 1.7 0 0 0-1.84.36l-.07.06h-3.4l-.02-.09a1.7 1.7 0 0 0-1.18-1.43l-.09-.03-2.94 1.7-.06-.07a1.7 1.7 0 0 0-1.88-.34l-.08.03-1.7-2.94.07-.06a1.7 1.7 0 0 0 .36-1.84l-.03-.09v-3.4l.09-.02a1.7 1.7 0 0 0 1.43-1.18l.03-.09-1.7-2.94.07-.06a1.7 1.7 0 0 0 .34-1.88l-.03-.08 2.94-1.7.06.07a1.7 1.7 0 0 0 1.84.36l.09-.03h3.4l.02.09a1.7 1.7 0 0 0 1.18 1.43l.09.03 2.94-1.7.06.07a1.7 1.7 0 0 0 1.88.34l.08-.03 1.7 2.94-.07.06a1.7 1.7 0 0 0-.36 1.84l.03.09v3.4l-.09.02a1.7 1.7 0 0 0-1.43 1.18l-.03.09z"></path></svg>','Настройки']];
    const titles = {overview:'Добрый день',bookings:'Записи',schedule:'Расписание',clients:'Клиенты',settings:'Настройки'};
    let content = adminTab==='overview'?renderOverview():adminTab==='bookings'?renderBookings():adminTab==='schedule'?renderSchedule():adminTab==='clients'?renderClients():renderSettings();
    root.innerHTML = '<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-brand">ШИНА<span>+</span></div><div class="shop-chip"><div class="shop-avatar">Ш+</div><div><strong>'+esc(data.settings.shopName)+'</strong><small>Мастерская · Москва</small></div></div><nav class="admin-nav">'+nav.map(function(n){return '<button class="'+(adminTab===n[0]?'active':'')+'" data-action="go-tab" data-tab="'+n[0]+'"><span class="nav-icon">'+n[1]+'</span><span class="nav-label">'+n[2]+'</span></button>';}).join('')+'</nav><div class="sidebar-bottom"><nav class="admin-nav"><button data-action="go-client"><span class="nav-icon">↗︎</span><span class="nav-label">Клиентская страница</span></button></nav></div></aside><main class="admin-main"><header class="admin-topbar"><div><h1 class="admin-title">'+titles[adminTab]+'</h1><div class="admin-subtitle">'+(adminTab==='overview'?'Сезон в разгаре. Вот что происходит в мастерской.':adminTab==='bookings'?esc(fullDate(selectedDate)):adminTab==='schedule'?esc(fullDate(selectedDate)):adminTab==='clients'?'История визитов и автомобили':'Управляйте расписанием, услугами и данными мастерской')+'</div></div><div class="top-actions"><button class="icon-button" data-action="notify-test" aria-label="Уведомления">♧</button><button class="top-button" data-action="add-booking">＋ Новая запись</button><div class="avatar">АД</div></div></header>'+content+'</main></div>';
  }
  function render() { if (page==='admin') renderAdmin(); else renderClient(); }
  function renderAdminLogin() {
    const old=document.querySelector('.modal-backdrop');if(old)old.remove();
    const modal=document.createElement('div');modal.className='modal-backdrop';
    modal.innerHTML='<div class="modal admin-modal admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title"><button class="modal-close" data-action="close-modal" aria-label="Закрыть">×</button><div class="micro">ШИНА+ · ДЛЯ СОТРУДНИКОВ</div><h2 id="admin-login-title">Вход в кабинет</h2><div class="field"><label for="admin-password">Пароль</label><input id="admin-password" type="password" autocomplete="current-password" placeholder="Введите пароль"></div><p id="admin-login-error" class="login-error hidden" role="alert">Пароль не подошёл. Попробуйте ещё раз.</p><div class="modal-actions"><button class="btn-light" data-action="close-modal">Отмена</button><button class="btn-black" data-action="admin-login">Войти <b>→</b></button></div></div>';
    document.body.appendChild(modal);document.getElementById('admin-password').focus();
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  }
  function requestAdminAccess() {
    if(hasAdminAccess()){page='admin';renderAdmin();return;}
    renderAdminLogin();
  }
  function submitAdminLogin() {
    const input=document.getElementById('admin-password');
    if(!input)return;
    if(input.value===getAdminPassword()){
      try{localStorage.setItem(ADMIN_AUTH_KEY,'true');}catch(e){}
      closeModal();page='admin';adminTab='overview';renderAdmin();showToast('Вход выполнен');
      return;
    }
    const error=document.getElementById('admin-login-error');if(error)error.classList.remove('hidden');
    input.value='';input.focus();
  }
  function changeAdminPassword() {
    const oldInput=document.getElementById('old-admin-password');
    const newInput=document.getElementById('new-admin-password');
    const repeatInput=document.getElementById('repeat-admin-password');
    const message=document.getElementById('password-change-message');
    if(!oldInput||!newInput||!repeatInput||!message)return;
    const oldPassword=oldInput.value;
    const newPassword=newInput.value;
    const repeatPassword=repeatInput.value;
    message.classList.remove('hidden','success');
    if(oldPassword!==getAdminPassword()){message.textContent='Старый пароль введён неверно.';return;}
    if(newPassword.length<6){message.textContent='Новый пароль должен содержать не менее 6 символов.';return;}
    if(newPassword!==repeatPassword){message.textContent='Новые пароли не совпадают.';return;}
    if(newPassword===oldPassword){message.textContent='Новый пароль должен отличаться от старого.';return;}
    try{localStorage.setItem(ADMIN_PASSWORD_KEY,newPassword);}catch(e){message.textContent='Не удалось сохранить пароль в этом браузере.';return;}
    oldInput.value='';newInput.value='';repeatInput.value='';
    message.textContent='Пароль успешно изменён.';message.classList.add('success');
  }
  function openBooking(prefill) {
    bookingStep=1;
    bookingDraft={services:[],date:'',time:'',carType:'Легковой',diameter:'R16',carModel:'',extras:[]};
    if (prefill) { bookingDraft.date=prefill.date||'';bookingDraft.time=prefill.time||''; }
    renderBookingModal();
  }
  function renderBookingModal() {
    const old=document.querySelector('.modal-backdrop'); if (old) old.remove();
    const isAdmin=page==='admin';
    let body='';
    if (bookingStep===1) {
      body='<div class="micro">ШАГ 01 / ВЫБЕРИТЕ РАБОТЫ</div><div class="choice-grid">'+data.services.map(function(s){return '<button class="choice '+(bookingDraft.services.includes(s.id)?'selected':'')+'" data-action="toggle-service" data-id="'+esc(s.id)+'"><span>'+esc(s.name)+'<small>'+s.duration+' минут</small></span><strong>'+rub(s.price)+'</strong></button>';}).join('')+'</div>';
    } else if (bookingStep===2) {
      body='<div class="micro">ШАГ 02 / ВАШ АВТОМОБИЛЬ</div><div class="form-row"><div class="field"><label>Тип автомобиля</label><select id="car-type"><option>Легковой</option><option>Кроссовер</option><option>Внедорожник</option><option>Микроавтобус</option></select></div><div class="field"><label>Диаметр колёс</label><select id="diameter">'+Array.from({length:10},function(_,i){return '<option '+(bookingDraft.diameter==='R'+(13+i)?'selected':'')+'>R'+(13+i)+'</option>';}).join('')+'</select></div></div><div class="field"><label>Марка и модель · необязательно</label><input id="car-model" value="'+esc(bookingDraft.carModel||'')+'" placeholder="Например, Kia Sportage"></div><div class="field"><label>Особенности автомобиля</label><div class="choice-grid"><button class="choice '+(bookingDraft.extras.some(function(x){return x.id==='runflat';})?'selected':'')+'" data-action="toggle-extra" data-extra="runflat">Run-flat / низкий профиль <strong>+800 ₽</strong></button><button class="choice '+(bookingDraft.extras.some(function(x){return x.id==='tpms';})?'selected':'')+'" data-action="toggle-extra" data-extra="tpms">Датчики TPMS <strong>+1 200 ₽</strong></button></div></div>';
    } else if (bookingStep===3) {
      let dayHtml='';
      for(let i=0;i<10;i++){const day=dateOffset(i);const slots=availableSlots(day,Math.max(20,draftDuration()||50));const date=new Date(day+'T12:00:00');const off=data.hours.daysOff.includes(date.getDay());dayHtml+='<button class="choice '+(bookingDraft.date===day?'selected':'')+'" data-action="select-book-date" data-date="'+day+'" '+(off?'disabled':'')+'><span>'+dateRu(day,{weekday:'short',day:'numeric',month:'short'})+'<small>'+(off?'Выходной':slots.length+' свободных окон')+'</small></span><strong>'+(off?'—':slots.length?'›':'×')+'</strong></button>';}
      const slots=bookingDraft.date?availableSlots(bookingDraft.date,Math.max(20,draftDuration()||50)):[];
      body='<div class="micro">ШАГ 03 / ВЫБЕРИТЕ ДЕНЬ И ВРЕМЯ</div><div class="choice-grid">'+dayHtml+'</div>'+(bookingDraft.date?'<div class="field"><label>Свободное время · '+esc(dateRu(bookingDraft.date))+'</label><div class="time-grid">'+slots.slice(0,16).map(function(s){return '<button class="time-choice '+(bookingDraft.time===s.time?'selected':'')+'" data-action="select-book-time" data-time="'+s.time+'">'+s.time+'</button>';}).join('')+(slots.length?'':'<span class="legal">Нет окон в этот день</span>')+'</div></div>':'');
    } else if (bookingStep===4) {
      body='<div class="micro">ШАГ 04 / КОНТАКТЫ</div><div class="form-row"><div class="field"><label>Ваше имя</label><input id="customer-name" placeholder="Как к вам обращаться"></div><div class="field"><label>Телефон</label><input id="customer-phone" type="tel" placeholder="+7 (___) ___-__-__" inputmode="tel"></div></div><div class="field"><label>Комментарий для мастера</label><textarea id="customer-note" placeholder="Например, есть секретки или нужно проверить прокол"></textarea></div><label class="legal"><input type="checkbox" id="consent"> Согласен(на) на обработку персональных данных и ознакомлен(а) с правилами визита.</label>';
    }
    const selected = pickedServices();
    const summary=selected.length?selected.map(function(s){return s.name;}).join(', '):'Выберите услуги';
    const suffix=bookingStep<4?'<div class="booking-summary"><span>'+esc(summary)+' · '+(draftDuration()||0)+' мин</span><strong>'+rub(draftPrice())+'</strong></div>':'';
    const footer=bookingStep===1?'<div class="modal-actions"><button class="btn-light" data-action="close-modal">Закрыть</button><button class="btn-black" data-action="booking-next" '+(selected.length?'':'disabled style="opacity:.5"')+'>Далее <b>→</b></button></div>':bookingStep===4?'<div class="modal-actions"><button class="btn-light" data-action="booking-prev">← Назад</button><button class="btn-black" data-action="submit-booking">Записаться <b>↗︎</b></button></div>':'<div class="modal-actions"><button class="btn-light" data-action="booking-prev">← Назад</button><button class="btn-black" data-action="booking-next" '+(bookingStep===3&&(!bookingDraft.date||!bookingDraft.time)?'disabled style="opacity:.5"':'')+'>Далее <b>→</b></button></div>';
    const modal=document.createElement('div');modal.className='modal-backdrop';modal.innerHTML='<div class="modal '+(isAdmin?'admin-modal':'')+'" role="dialog" aria-modal="true" aria-label="Запись на шиномонтаж"><button class="modal-close" data-action="close-modal" aria-label="Закрыть">×</button><div class="micro">ШИНА+ · ОНЛАЙН-ЗАПИСЬ</div><h2>'+ (bookingStep===4?'Почти готово':'Записаться') +'</h2><div class="stepper">'+[1,2,3,4].map(function(s){return '<span class="step-seg '+(s<=bookingStep?'active':'')+'"></span>';}).join('')+'</div>'+body+suffix+footer+'</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  }
  function closeModal(){const el=document.querySelector('.modal-backdrop');if(el)el.remove();}
  function createBooking(isAdmin) {
    const name=document.getElementById('customer-name'); const phone=document.getElementById('customer-phone');
    if(!isAdmin && (!name||!name.value.trim()||!phone||phone.value.replace(/\D/g,'').length<10)){showToast('Укажите имя и номер телефона');return;}
    if(!isAdmin && !document.getElementById('consent').checked){showToast('Нужно согласие на обработку данных');return;}
    const chosenDate=bookingDraft.date||dateOffset(0), chosenTime=bookingDraft.time||'10:00';
    const slot=availableSlots(chosenDate,Math.max(20,draftDuration()||50))[0];
    const booking={id:'D'+Math.floor(2000+Math.random()*7000),date:chosenDate,time:chosenTime,name:isAdmin?(name&&name.value.trim()||'Новый клиент'):name.value.trim(),phone:isAdmin?(phone&&phone.value||'+7 900 000-00-00'):phone.value.trim(),car:bookingDraft.carModel&&bookingDraft.carModel.trim()||'Автомобиль не указан',wheel:bookingDraft.diameter,service:pickedServices().map(function(s){return s.name;}).join(', '),price:draftPrice(),duration:Math.max(20,draftDuration()),post:slot?slot.post:1,status:data.settings.autoConfirm?'confirmed':'new',source:isAdmin?'Телефон':'Онлайн',note:document.getElementById('customer-note')?document.getElementById('customer-note').value:'',token:Math.random().toString(36).slice(2,16)};
    data.bookings.push(booking);saveData();closeModal();
    if(isAdmin){selectedDate=chosenDate;adminTab='bookings';renderAdmin();showToast('Запись добавлена · клиенту отправлено уведомление');}
    else {showSuccess(booking);}
  }
  function showSuccess(b) {
    const modal=document.createElement('div');modal.className='modal-backdrop';modal.innerHTML='<div class="modal" role="dialog" aria-modal="true"><button class="modal-close" data-action="close-modal">×</button><div class="micro">ШИНА+ · ГОТОВО</div><div class="success-mark">✓</div><h2>Вы записаны</h2><p style="line-height:1.6">Заявка <strong>'+esc(b.id)+'</strong> на <strong>'+esc(dateRu(b.date,{day:'numeric',month:'long'}))+' в '+esc(b.time)+'</strong>.<br>'+esc(b.status==='confirmed'?'Мастерская ждёт вас.':'Мы скоро подтвердим запись.')+'</p><div class="booking-summary"><span>'+esc(b.service)+'<br>'+esc(b.car)+' · '+esc(b.wheel)+'</span><strong>'+rub(b.price)+'</strong></div><div class="modal-actions"><a class="btn-light" href="https://yandex.ru/maps/?text='+encodeURIComponent(data.settings.address)+'" target="_blank">Маршрут ↗︎</a><button class="btn-black" data-action="close-modal">Готово</button></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn-light" style="flex:1" data-action="manage-booking" data-id="'+esc(b.id)+'">Изменить запись</button><button class="btn-light" style="flex:1" data-action="client-cancel" data-id="'+esc(b.id)+'">Отменить</button></div><p class="legal">В демо-версии ваша запись доступна только в этом браузере. В рабочем сервисе здесь будет персональная ссылка из уведомления.</p></div>';document.body.appendChild(modal);
  }
  function manageClientBooking(id) {
    const b=data.bookings.find(function(x){return x.id===id;});if(!b)return;
    const modal=document.createElement('div');modal.className='modal-backdrop';modal.innerHTML='<div class="modal" role="dialog" aria-modal="true"><button class="modal-close" data-action="close-modal">×</button><div class="micro">ШИНА+ · МОЯ ЗАПИСЬ</div><h2>Детали визита</h2><div class="booking-summary"><span>'+esc(dateRu(b.date,{weekday:"long",day:"numeric",month:"long"}))+' · '+esc(b.time)+'<br>'+esc(b.service)+'<br>'+esc(b.car)+' · '+esc(b.wheel)+'</span><strong>'+statusLabels[b.status]+'</strong></div><p class="legal">Если планы изменились, перенесите визит или отмените запись.</p><div class="modal-actions"><button class="btn-light" data-action="client-cancel" data-id="'+esc(b.id)+'">Отменить запись</button><button class="btn-black" data-action="edit-booking" data-id="'+esc(b.id)+'">Перенести →</button></div></div>';document.body.appendChild(modal);
  }
  function changeStatus(id,status) {
    const b=data.bookings.find(function(x){return x.id===id;}); if(!b)return;
    b.status=status; b.updatedAt=new Date().toISOString();data.bookings=data.bookings.map(function(x){return x.id===id?b:x;});saveData();renderAdmin();showToast('Статус изменён: '+statusLabels[status]+' · клиент уведомлён');
  }
  function editBooking(id) {
    const b=data.bookings.find(function(x){return x.id===id;});if(!b)return;
    bookingDraft={services:[],date:b.date,time:b.time,carType:'Легковой',diameter:b.wheel||'R16',carModel:b.car||'',extras:[]};bookingStep=3;
    renderBookingModal();
    const modal=document.querySelector('.modal');const head=modal.querySelector('h2');if(head)head.textContent='Перенести запись';
    const footer=modal.querySelector('.modal-actions');if(footer)footer.innerHTML='<button class="btn-light" data-action="close-modal">Закрыть</button><button class="btn-black" data-action="save-reschedule" data-id="'+esc(id)+'">Сохранить время →</button>';
  }
  function saveReschedule(id) {
    if(!bookingDraft.date||!bookingDraft.time){showToast('Выберите новую дату и время');return;}
    const b=data.bookings.find(function(x){return x.id===id;});if(!b)return;
    b.date=bookingDraft.date;b.time=bookingDraft.time;b.status='confirmed';saveData();closeModal();if(page==='admin')renderAdmin();else renderClient();showToast('Время перенесено · клиент уведомлён');
  }
  function cancelFromClient(id) {
    const b=data.bookings.find(function(x){return x.id===id;});if(!b)return;
    b.status='cancelled';saveData();closeModal();renderClient();showToast('Запись отменена · мастерская уведомлена');
  }
  function setTab(tab) { adminTab=tab;page='admin';try{localStorage.setItem('shina-plus-admin-tab',tab);}catch(e){}renderAdmin(); }
  function saveSettings() {
    document.querySelectorAll('[data-setting]').forEach(function(el){const key=el.getAttribute('data-setting');const value=el.value;if(key==='shopName'||key==='address'||key==='phone')data.settings[key]=value;if(key==='open')data.hours.open=value;if(key==='close')data.hours.close=value;if(key==='posts')data.posts=Math.max(1,Math.min(12,Number(value)||1));if(key==='buffer')data.settings.buffer=Math.max(0,Number(value)||0);if(key==='autoConfirm')data.settings.autoConfirm=value==='true';});
    const off=[];document.querySelectorAll('[data-dayoff]').forEach(function(el){if(el.checked)off.push(Number(el.getAttribute('data-dayoff')));});data.hours.daysOff=off;saveData();renderAdmin();showToast('Настройки сохранены');
  }
  function applyFilter(status) {
    bookingFilter=status;renderAdmin();
  }
  document.addEventListener('click',function(e){
    const slotButton=e.target.closest('[data-slot-date]');
    if(slotButton){openBooking({date:slotButton.getAttribute('data-slot-date'),time:slotButton.getAttribute('data-slot-time')});return;}
    const el=e.target.closest('[data-action]'); if(!el)return;
    const action=el.getAttribute('data-action'); const id=el.getAttribute('data-id');
    if(action==='secret-admin'){e.preventDefault();adminTapCount++;clearTimeout(adminTapTimer);adminTapTimer=setTimeout(function(){adminTapCount=0;},2500);if(adminTapCount>=5){adminTapCount=0;clearTimeout(adminTapTimer);requestAdminAccess();}return;}
    if(action==='open-booking'){openBooking();return;}
    if(action==='go-admin'){requestAdminAccess();return;}
    if(action==='admin-login'){submitAdminLogin();return;}
    if(action==='change-admin-password'){changeAdminPassword();return;}
    if(action==='go-client'){page='client';renderClient();window.scrollTo(0,0);return;}
    if(action==='close-modal'){closeModal();return;}
    if(action==='booking-next'){if(bookingStep===1&&!bookingDraft.services.length){showToast('Выберите хотя бы одну услугу');return;}if(bookingStep===3&&(!bookingDraft.date||!bookingDraft.time)){showToast('Выберите свободное время');return;}if(bookingStep===2){const type=document.getElementById('car-type');const dia=document.getElementById('diameter');const model=document.getElementById('car-model');if(type)bookingDraft.carType=type.value;if(dia)bookingDraft.diameter=dia.value;if(model)bookingDraft.carModel=model.value.trim();}bookingStep=Math.min(4,bookingStep+1);renderBookingModal();return;}
    if(action==='booking-prev'){if(bookingStep===2){const type=document.getElementById('car-type');const dia=document.getElementById('diameter');const model=document.getElementById('car-model');if(type)bookingDraft.carType=type.value;if(dia)bookingDraft.diameter=dia.value;if(model)bookingDraft.carModel=model.value.trim();}bookingStep=Math.max(1,bookingStep-1);renderBookingModal();return;}
    if(action==='toggle-service'){const sid=el.getAttribute('data-id');bookingDraft.services=bookingDraft.services.includes(sid)?bookingDraft.services.filter(function(x){return x!==sid;}):bookingDraft.services.concat([sid]);renderBookingModal();return;}
    if(action==='toggle-extra'){const sid=el.getAttribute('data-extra');const price=sid==='runflat'?800:1200;bookingDraft.extras=bookingDraft.extras.some(function(x){return x.id===sid;})?bookingDraft.extras.filter(function(x){return x.id!==sid;}):bookingDraft.extras.concat([{id:sid,price:price}]);renderBookingModal();return;}
    if(action==='select-book-date'){bookingDraft.date=el.getAttribute('data-date');bookingDraft.time='';renderBookingModal();return;}
    if(action==='select-book-time'){bookingDraft.time=el.getAttribute('data-time');renderBookingModal();return;}
    if(action==='submit-booking'){createBooking(page==='admin');return;}
    if(action==='save-reschedule'){saveReschedule(id);return;}
    if(action==='status'){changeStatus(id,el.getAttribute('data-status'));return;}
    if(action==='edit-booking'){editBooking(id);return;}
    if(action==='manage-booking'){manageClientBooking(id);return;}
    if(action==='client-cancel'){cancelFromClient(id);return;}
    if(action==='add-booking'){bookingStep=1;openBooking();return;}
    if(action==='go-tab'){setTab(el.getAttribute('data-tab'));return;}
    if(action==='select-date'){selectedDate=el.getAttribute('data-date');renderAdmin();return;}
    if(action==='filter-status'){applyFilter(el.getAttribute('data-status'));return;}
    if(action==='save-settings'){saveSettings();return;}
    if(action==='save-prices'){document.querySelectorAll('[data-service-price]').forEach(function(input){const s=getService(input.getAttribute('data-service-price'));if(s)s.price=Math.max(0,Number(input.value)||0);});saveData();renderAdmin();showToast('Цены обновлены');return;}
    if(action==='reset-demo'){if(confirm('Сбросить изменения и восстановить исходные демо-данные?')){localStorage.removeItem(KEY);data=seed();saveData();renderAdmin();showToast('Демо-данные восстановлены');}return;}
    if(action==='notify-test'){showToast('Уведомления включены в демо-режиме');return;}
    if(action==='install-app'){if(installPrompt){installPrompt.prompt();installPrompt=null;}else showToast('В браузере откройте меню и выберите «Установить приложение»');const box=document.querySelector('.install-banner');if(box)box.remove();return;}
    if(action==='dismiss-install'){const box=document.querySelector('.install-banner');if(box)box.remove();sessionStorage.setItem('shina-install-seen','1');return;}
    if(action==='calendar-view'){showToast('Недельный вид появится в следующей версии');return;}
  });
  document.addEventListener('change',function(e){
    const el=e.target;
    if(el.matches('[data-change="date-filter"]')){selectedDate=el.value;renderAdmin();}
    if(el.id==='diameter'){bookingDraft.diameter=el.value;}
    if(el.id==='car-type'){bookingDraft.carType=el.value;}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&e.target.id==='admin-password'){e.preventDefault();submitAdminLogin();}});
  document.addEventListener('input',function(e){
    if(e.target.id==='car-model'){bookingDraft.carModel=e.target.value.trim();}
    if(e.target.id==='client-search'){const value=e.target.value.toLowerCase();document.querySelectorAll('#clients-table tbody tr').forEach(function(row){row.style.display=row.textContent.toLowerCase().includes(value)?'':'none';});}
    if(e.target.id==='customer-phone'){let digits=e.target.value.replace(/\D/g,'');if(digits.charAt(0)==='8')digits='7'+digits.slice(1);if(digits.charAt(0)!=='7'&&digits.length)digits='7'+digits;e.target.value=digits.length>1?'+7 ('+digits.slice(1,4)+(digits.length>=4?') ':'')+digits.slice(4,7)+(digits.length>=7?'-':'')+digits.slice(7,9)+(digits.length>=9?'-':'')+digits.slice(9,11):'+7 (';}
  });
  window.addEventListener('storage',function(e){
    if(e.key!==KEY||!e.newValue)return;
    try{
      const updated=JSON.parse(e.newValue);
      if(!updated||!updated.bookings||!updated.services)return;
      data=updated;
      if(!document.querySelector('.modal-backdrop'))render();
    }catch(error){}
  });
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();installPrompt=e;});
  window.addEventListener('appinstalled',function(){showToast('ШИНА+ добавлена на экран');});
  if(location.hash==='#admin'&&!hasAdminAccess())page='client';
  render();
})();
