/**
 * Selector y edición de perfiles (hermanos en el mismo dispositivo)
 */
(function (global) {
  'use strict';

  var addModal;
  var editModal;
  var editingId = null;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function renderBar() {
    if (!global.LipaBrainProfiles) return;
    var bar = document.getElementById('brain-profile-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'brain-profile-bar';
      bar.className = 'brain-profile-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Perfiles de jugador');
      var nav = document.querySelector('.site-nav');
      if (nav && nav.parentNode) {
        nav.parentNode.insertBefore(bar, nav.nextSibling);
      } else {
        document.body.insertBefore(bar, document.body.firstChild);
      }
    }
    if (bar.tagName.toLowerCase() === 'xxx') {
      var rep = document.createElement('div');
      rep.id = 'brain-profile-bar';
      rep.className = bar.className;
      rep.setAttribute('role', 'region');
      rep.setAttribute('aria-label', 'Perfiles de jugador');
      bar.parentNode.replaceChild(rep, bar);
      bar = rep;
    }

    var list = LipaBrainProfiles.listProfiles();
    var active = LipaBrainProfiles.getActiveId();
    var inner = document.createElement('div');
    inner.className = 'brain-profile-bar__inner';

    var label = document.createElement('span');
    label.className = 'brain-profile-bar__label';
    label.textContent = '¿Quién juega?';
    inner.appendChild(label);

    list.forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'brain-profile-chip' + (p.id === active ? ' brain-profile-chip--active' : '');
      btn.setAttribute('data-profile-id', p.id);
      btn.setAttribute('aria-pressed', p.id === active ? 'true' : 'false');
      btn.title = p.id === active ? 'Clic otra vez para editar nombre y avatar' : 'Cambiar a ' + p.name;
      btn.innerHTML = '<span aria-hidden="true">' + esc(p.emoji) + '</span> ' + esc(p.name);
      btn.addEventListener('click', function () {
        if (p.id === LipaBrainProfiles.getActiveId()) openEditModal(p);
        else {
          LipaBrainProfiles.switchProfile(p.id);
          global.location.reload();
        }
      });
      inner.appendChild(btn);
    });

    var add = document.createElement('button');
    add.type = 'button';
    add.className = 'brain-profile-chip brain-profile-chip__add';
    add.textContent = '+ Hermano/a';
    add.addEventListener('click', openAddModal);
    inner.appendChild(add);

    bar.innerHTML = '';
    bar.appendChild(inner);
  }

  function buildEmojiGrid(selected, hiddenId) {
    var emojis = LipaBrainProfiles.EMOJIS || ['🦊', '🐼', '🦁'];
    var wrap = document.createElement('div');
    wrap.className = 'brain-profile-emoji-block';
    var lbl = document.createElement('p');
    lbl.className = 'brain-profile-emoji-label';
    lbl.textContent = 'Elige tu avatar';
    wrap.appendChild(lbl);
    var grid = document.createElement('div');
    grid.className = 'brain-profile-emoji-grid';
    var hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.id = hiddenId;
    hidden.value = selected || emojis[0];
    emojis.forEach(function (e) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'brain-profile-emoji' + (e === hidden.value ? ' brain-profile-emoji--on' : '');
      b.setAttribute('data-emoji', e);
      b.textContent = e;
      b.addEventListener('click', function () {
        hidden.value = e;
        grid.querySelectorAll('.brain-profile-emoji').forEach(function (x) {
          x.classList.toggle('brain-profile-emoji--on', x === b);
        });
      });
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    wrap.appendChild(hidden);
    return wrap;
  }

  function setupModal(id, title) {
    var modal = document.createElement('div');
    modal.className = 'brain-profile-modal';
    modal.id = id;
    modal.hidden = true;
    var backdrop = document.createElement('div');
    backdrop.className = 'brain-profile-modal__backdrop';
    backdrop.addEventListener('click', function () { modal.hidden = true; });
    var panel = document.createElement('div');
    panel.className = 'brain-profile-modal__panel';
    panel.setAttribute('role', 'dialog');
    var h = document.createElement('h2');
    h.textContent = title;
    panel.appendChild(h);
    modal.appendChild(backdrop);
    modal.appendChild(panel);
    document.body.appendChild(modal);
    return { modal: modal, panel: panel };
  }

  function ensureAddModal() {
    if (addModal) return addModal;
    var parts = setupModal('brain-profile-add-modal', 'Nuevo jugador');
    addModal = parts.modal;
    var panel = parts.panel;

    var nameLbl = document.createElement('label');
    nameLbl.htmlFor = 'profile-name';
    nameLbl.textContent = 'Nombre';
    var nameIn = document.createElement('input');
    nameIn.type = 'text';
    nameIn.id = 'profile-name';
    nameIn.maxLength = 20;
    nameIn.placeholder = 'Ej: Ana';
    nameIn.autocomplete = 'nickname';

    panel.appendChild(nameLbl);
    panel.appendChild(nameIn);
    panel.appendChild(buildEmojiGrid('🦊', 'profile-emoji-new'));

    var courseLbl = document.createElement('label');
    courseLbl.htmlFor = 'profile-course';
    courseLbl.textContent = 'Curso (opcional)';
    var courseSel = document.createElement('select');
    courseSel.id = 'profile-course';
    panel.appendChild(courseLbl);
    panel.appendChild(courseSel);

    var actions = document.createElement('div');
    actions.className = 'brain-profile-modal__actions';
    var save = document.createElement('button');
    save.type = 'button';
    save.className = 'lipa-btn lipa-btn--primary';
    save.textContent = 'Crear perfil';
    save.addEventListener('click', function () {
      var name = nameIn.value.trim();
      var emoji = document.getElementById('profile-emoji-new').value;
      var courseId = courseSel.value || null;
      if (!name) { nameIn.focus(); return; }
      LipaBrainProfiles.createProfile({ name: name, courseId: courseId, emoji: emoji });
      addModal.hidden = true;
      if (courseId) global.location.href = '/?onboarding=1';
      else global.location.reload();
    });
    var cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'lipa-btn lipa-btn--secondary';
    cancel.textContent = 'Cancelar';
    cancel.addEventListener('click', function () { addModal.hidden = true; });
    actions.appendChild(save);
    actions.appendChild(cancel);
    panel.appendChild(actions);
    return addModal;
  }

  function ensureEditModal() {
    if (editModal) return editModal;
    var parts = setupModal('brain-profile-edit-modal', 'Editar jugador');
    editModal = parts.modal;
    var panel = parts.panel;

    var nameLbl = document.createElement('label');
    nameLbl.htmlFor = 'profile-edit-name';
    nameLbl.textContent = 'Nombre';
    var nameIn = document.createElement('input');
    nameIn.type = 'text';
    nameIn.id = 'profile-edit-name';
    nameIn.maxLength = 20;
    panel.appendChild(nameLbl);
    panel.appendChild(nameIn);

    var emojiMount = document.createElement('div');
    emojiMount.id = 'profile-edit-emoji-mount';
    panel.appendChild(emojiMount);

    var courseLbl = document.createElement('label');
    courseLbl.htmlFor = 'profile-edit-course';
    courseLbl.textContent = 'Curso';
    var courseSel = document.createElement('select');
    courseSel.id = 'profile-edit-course';
    panel.appendChild(courseLbl);
    panel.appendChild(courseSel);

    var actions = document.createElement('div');
    actions.className = 'brain-profile-modal__actions';
    var save = document.createElement('button');
    save.type = 'button';
    save.className = 'lipa-btn lipa-btn--primary';
    save.textContent = 'Guardar';
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'lipa-btn lipa-btn--danger';
    del.textContent = 'Eliminar';
    var cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'lipa-btn lipa-btn--secondary';
    cancel.textContent = 'Cancelar';

    save.addEventListener('click', function () {
      if (!editingId) return;
      var name = nameIn.value.trim();
      var emoji = document.getElementById('profile-emoji-edit').value;
      var courseId = courseSel.value || null;
      if (!name) return;
      LipaBrainProfiles.updateProfileMeta(editingId, { name: name, emoji: emoji, courseId: courseId });
      editModal.hidden = true;
      global.location.reload();
    });
    del.addEventListener('click', function () {
      if (!editingId || !global.confirm('¿Eliminar este perfil? Se pierde su progreso.')) return;
      LipaBrainProfiles.removeProfile(editingId);
      editModal.hidden = true;
      global.location.reload();
    });
    cancel.addEventListener('click', function () { editModal.hidden = true; });

    actions.appendChild(save);
    actions.appendChild(del);
    actions.appendChild(cancel);
    panel.appendChild(actions);
    if (actions.tagName.toLowerCase() === 'xxx') {
      var ad = document.createElement('div');
      ad.className = actions.className;
      while (actions.firstChild) ad.appendChild(actions.firstChild);
      panel.replaceChild(ad, actions);
    }
    return editModal;
  }

  function fillCourses(selectId, emptyLabel) {
    var sel = document.getElementById(selectId);
    if (!sel || !global.LipaCurriculum) return;
    LipaCurriculum.init();
    var html = '<option value="">' + esc(emptyLabel) + '</option>';
    LipaCurriculum.listStages().forEach(function (stage) {
      stage.courses.forEach(function (c) {
        if (c.status === 'soon') return;
        html += '<option value="' + esc(c.id) + '">' + esc(c.label) + '</option>';
      });
    });
    sel.innerHTML = html;
  }

  function openAddModal() {
    ensureAddModal();
    fillCourses('profile-course', 'Elegir después');
    document.getElementById('profile-name').value = '';
    addModal.hidden = false;
    document.getElementById('profile-name').focus();
  }

  function openEditModal(profile) {
    ensureEditModal();
    editingId = profile.id;
    fillCourses('profile-edit-course', 'Sin curso');
    document.getElementById('profile-edit-name').value = profile.name;
    var mount = document.getElementById('profile-edit-emoji-mount');
    mount.innerHTML = '';
    mount.appendChild(buildEmojiGrid(profile.emoji, 'profile-emoji-edit'));
    var sel = document.getElementById('profile-edit-course');
    if (profile.courseId) sel.value = profile.courseId;
    var delBtn = editModal.querySelector('.lipa-btn--danger');
    if (delBtn) delBtn.hidden = LipaBrainProfiles.listProfiles().length <= 1;
    editModal.hidden = false;
    document.getElementById('profile-edit-name').focus();
  }

  document.addEventListener('DOMContentLoaded', renderBar);
  global.addEventListener('lipa-profile-changed', renderBar);

  global.LipaProfileSwitcher = { mount: renderBar, openAddModal: openAddModal, openEditModal: openEditModal };
})(typeof window !== 'undefined' ? window : global);
