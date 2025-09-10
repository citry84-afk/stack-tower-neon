/**
 * Sistema de Notificaciones ReservasPro
 * Maneja envío automático de recordatorios y confirmaciones
 */

class NotificationManager {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('businessNotifications') || '{}');
        this.init();
    }

    init() {
        this.setupDefaultSettings();
        this.scheduleNotifications();
        console.log('📢 NotificationManager initialized');
    }

    setupDefaultSettings() {
        if (!this.settings.enabled) {
            this.settings = {
                enabled: true,
                reminder24h: 'all',
                reminder2h: 'whatsapp',
                bookingConfirmation: 'email',
                cancellationNotice: 'whatsapp',
                templates: {
                    reminder24h: 'Hola {cliente}, te recordamos tu cita mañana a las {hora} para {servicio}. ¡Te esperamos en {negocio}!',
                    reminder2h: '🕐 Tu cita es en 2 horas ({hora}). ¡No olvides confirmar tu asistencia!',
                    confirmation: '✅ Cita confirmada para {fecha} a las {hora}. Servicio: {servicio}. ¡Gracias por elegirnos!'
                }
            };
        }
    }

    // Simular envío de notificación
    sendNotification(type, method, appointment) {
        if (!this.settings.enabled) return;

        const template = this.getTemplate(type);
        const message = this.formatMessage(template, appointment);

        console.group(`📧 Enviando ${type} via ${method}`);
        console.log('Destinatario:', appointment.client);
        console.log('Teléfono:', appointment.phone || 'No disponible');
        console.log('Mensaje:', message);
        console.groupEnd();

        // Simular envío según el método
        switch(method) {
            case 'email':
                this.simulateEmail(appointment, message);
                break;
            case 'sms':
                this.simulateSMS(appointment, message);
                break;
            case 'whatsapp':
                this.simulateWhatsApp(appointment, message);
                break;
        }

        // Mostrar notificación en UI
        this.showUINotification(`${type} enviado via ${method} a ${appointment.client}`, 'success');
    }

    simulateEmail(appointment, message) {
        // En producción: integrar con servicio de email (SendGrid, Mailgun, etc.)
        console.log('📧 EMAIL enviado a:', appointment.client);
        
        // Simular delay de envío
        setTimeout(() => {
            this.logNotification('email', appointment, message, 'sent');
        }, 1000);
    }

    simulateSMS(appointment, message) {
        // En producción: integrar con servicio SMS (Twilio, etc.)
        console.log('💬 SMS enviado a:', appointment.phone);
        
        setTimeout(() => {
            this.logNotification('sms', appointment, message, 'sent');
        }, 1500);
    }

    simulateWhatsApp(appointment, message) {
        // En producción: integrar con WhatsApp Business API
        console.log('📱 WhatsApp enviado a:', appointment.phone);
        
        // Generar enlace de WhatsApp
        const whatsappUrl = `https://wa.me/${appointment.phone?.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
        console.log('🔗 WhatsApp URL:', whatsappUrl);
        
        setTimeout(() => {
            this.logNotification('whatsapp', appointment, message, 'sent');
        }, 800);
    }

    getTemplate(type) {
        return this.settings.templates[type] || '';
    }

    formatMessage(template, appointment) {
        const business = JSON.parse(localStorage.getItem('businessGeneral') || '{}');
        const businessName = business.businessName || 'ReservasPro';

        return template
            .replace(/{cliente}/g, appointment.client)
            .replace(/{hora}/g, appointment.time)
            .replace(/{servicio}/g, appointment.service)
            .replace(/{fecha}/g, this.formatDate(appointment.date))
            .replace(/{negocio}/g, businessName);
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Programar notificaciones automáticas
    scheduleNotifications() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const now = new Date();

        appointments.forEach(appointment => {
            if (appointment.status === 'cancelled') return;

            const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
            const timeDiff = appointmentDateTime - now;

            // Recordatorio 24h antes
            const reminder24h = timeDiff - (24 * 60 * 60 * 1000);
            if (reminder24h > 0 && reminder24h < (2 * 60 * 60 * 1000)) { // Si falta menos de 2h para el recordatorio
                setTimeout(() => {
                    this.sendReminderNotification('reminder24h', appointment);
                }, reminder24h);
            }

            // Recordatorio 2h antes
            const reminder2h = timeDiff - (2 * 60 * 60 * 1000);
            if (reminder2h > 0 && reminder2h < (30 * 60 * 1000)) { // Si falta menos de 30min para el recordatorio
                setTimeout(() => {
                    this.sendReminderNotification('reminder2h', appointment);
                }, reminder2h);
            }
        });
    }

    sendReminderNotification(type, appointment) {
        const setting = this.settings[type];
        if (setting === 'off') return;

        if (setting === 'all') {
            this.sendNotification(type, 'email', appointment);
            this.sendNotification(type, 'sms', appointment);
            this.sendNotification(type, 'whatsapp', appointment);
        } else {
            this.sendNotification(type, setting, appointment);
        }
    }

    // Enviar confirmación al crear cita
    sendBookingConfirmation(appointment) {
        const setting = this.settings.bookingConfirmation;
        
        if (setting === 'all') {
            this.sendNotification('confirmation', 'email', appointment);
            this.sendNotification('confirmation', 'sms', appointment);
            this.sendNotification('confirmation', 'whatsapp', appointment);
        } else {
            this.sendNotification('confirmation', setting, appointment);
        }
    }

    // Enviar notificación de cancelación
    sendCancellationNotice(appointment) {
        const setting = this.settings.cancellationNotice;
        const cancelTemplate = 'Su cita del {fecha} a las {hora} para {servicio} ha sido cancelada. ¡Esperamos verle pronto!';
        
        if (setting === 'all') {
            this.sendNotification('cancellation', 'email', appointment);
            this.sendNotification('cancellation', 'sms', appointment);
            this.sendNotification('cancellation', 'whatsapp', appointment);
        } else {
            this.sendNotification('cancellation', setting, appointment);
        }
    }

    // Log de notificaciones enviadas
    logNotification(method, appointment, message, status) {
        const log = JSON.parse(localStorage.getItem('notificationLog') || '[]');
        log.push({
            timestamp: new Date().toISOString(),
            method,
            appointment: appointment.id,
            client: appointment.client,
            message,
            status
        });
        
        // Mantener solo últimos 100 logs
        if (log.length > 100) {
            log.splice(0, log.length - 100);
        }
        
        localStorage.setItem('notificationLog', JSON.stringify(log));
    }

    // Mostrar notificación en UI
    showUINotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#1e40af'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : '📧'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Actualizar configuración
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('businessNotifications', JSON.stringify(this.settings));
        console.log('⚙️ Configuración de notificaciones actualizada');
    }

    // Test de notificaciones
    testNotification(type, method) {
        const testAppointment = {
            id: 'test',
            client: 'Cliente de Prueba',
            phone: '+34666777888',
            service: 'Corte',
            date: new Date().toISOString().split('T')[0],
            time: '10:00'
        };
        
        this.sendNotification(type, method, testAppointment);
    }
}

// CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar automáticamente
window.notificationManager = new NotificationManager();