(function($) {
    // Verificar si jsCalendar está disponible
    if (!$) throw 'Error: jsCalendar library was not found';

    // Constructor de yearmonthview
    var yearmonthview = function(options) {
        // Parsear las opciones
        this._options = Object.assign({
            year: new Date().getFullYear(), // Año que se mostrará
            monthsPerRow: 3, // Número de meses por fila
            calendarWidth: 300, // Ancho mínimo de cada calendario
            autoResponsive: true // Ajuste automático en pantallas pequeñas
        }, options);

        // Configurar el contenedor
        this._setTarget(this._options.target);
        // Renderizar calendarios
        this.renderCalendars();

        // Configurar eventos de redimensionamiento si es auto-responsive
        if (this._options.autoResponsive) {
            window.addEventListener('resize', this.renderCalendars.bind(this));
        }
    };

    // Configurar el contenedor
    yearmonthview.prototype._setTarget = function(target) {
        this._target = $.tools.getElement(target);
        if (!this._target) {
            throw new Error('jsCalendarYearMonthView: Target was not found.');
        }
    };

    // Renderizar los calendarios
    yearmonthview.prototype.renderCalendars = function() {
        const container = this._target;
        if (!container) {
            console.error(`Container with ID ${this._target} not found.`);
            return;
        }

        container.innerHTML = ''; // Limpiar el contenedor

        const totalMonths = 12;
        const containerWidth = container.clientWidth;
        const monthsPerRow = this.calculateMonthsPerRow(containerWidth);
        const calendarWidth = Math.max(Math.floor(containerWidth / monthsPerRow) - 20, this._options.calendarWidth);

        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(auto-fill, minmax(${calendarWidth}px, 1fr))`;
        container.style.gridGap = "10px";

        for (let i = 0; i < totalMonths; i++) {
            const calendarDiv = document.createElement('div');
            calendarDiv.style.width = `${calendarWidth}px`;
            container.appendChild(calendarDiv);

            const calendar = new $.new({
                target: calendarDiv,
                date: new Date(this._options.year, i, 1), // Establecer mes y año
                navigator: false, // Desactivar la navegación
                zeroFill: true, // Rellenar con ceros los días si es necesario
                dayFormat: 'DD', // Formato de dos dígitos para los días
                monthFormat: 'MONTH YYYY' // Formato claro para el mes y año
            });

            const tbody = calendarDiv.querySelector('tbody');
            const rows = tbody.querySelectorAll('tr');
            if (rows.length < 6) {
                for (let j = rows.length; j < 6; j++) {
                    const row = document.createElement('tr');
                    for (let k = 0; k < 7; k++) { // 7 días de la semana
                        const cell = document.createElement('td');
                        row.appendChild(cell);
                    }
                    tbody.appendChild(row);
                }
            }
        }
    };

    // Calcular el número de meses por fila
    yearmonthview.prototype.calculateMonthsPerRow = function(containerWidth) {
        const calculatedMonthsPerRow = Math.floor(containerWidth / this._options.calendarWidth);
        return Math.max(calculatedMonthsPerRow, 1);
    };

    // Extender jsCalendar con la nueva funcionalidad yearmonthview
    $.ext('yearmonthview', function(options) {
        return new yearmonthview(options);
    });

})(window.jsCalendar);
