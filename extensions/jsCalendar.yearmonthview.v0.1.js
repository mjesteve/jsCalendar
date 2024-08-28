(function (window, jsCalendar) {
    // Crear extensión yearmonthview
    var YearMonthView = function (element, options) {
        // Parsear opciones
        this._options = this._parseOptions(options);

        // Establecer el año y opciones por defecto
        this._year = this._options.year || new Date().getFullYear();
        this._monthsPerRow = this._options.monthsPerRow || 3;

        // Establecer el ancho predeterminado del calendario
        if (!this._options.calendarWidth) {
            this._options.calendarWidth = this._calculateCalendarWidth();
        }

        // Crear el contenedor principal
        this._container = element;
        this._container.classList.add('jsCalendar-yearmonthview-container');

        // Renderizar la vista anual
        this._render();
    };

    // Métodos extendidos
    YearMonthView.prototype = {
        _parseOptions: function (options) {
            var parsedOptions = {};
            for (var opt in options) {
                if (options.hasOwnProperty(opt)) {
                    parsedOptions[opt] = options[opt];
                }
            }
            return parsedOptions;
        },

        _calculateCalendarWidth: function () {
            // Crear un contenedor temporal en el DOM
            var tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            document.body.appendChild(tempContainer);

            // Crear una fila simulada de 7 días, aplicando las clases necesarias
            for (var i = 0; i < 7; i++) {
                var dayCell = document.createElement('div');
                dayCell.className = 'jsCalendar-day';
                dayCell.textContent = '00'; // Texto simulado
                tempContainer.appendChild(dayCell);
            }

            // Obtener el ancho de una celda
            var cell = tempContainer.querySelector('.jsCalendar-day');
            var cellStyle = window.getComputedStyle(cell);
            var cellWidth = parseFloat(cellStyle.width);
            var cellPadding = parseFloat(cellStyle.paddingLeft) + parseFloat(cellStyle.paddingRight);
            var cellBorder = parseFloat(cellStyle.borderLeftWidth) + parseFloat(cellStyle.borderRightWidth);

            // Calcular el ancho total de una celda
            var totalCellWidth = cellWidth + cellPadding + cellBorder;

            // Ancho total del calendario (7 celdas)
            var calendarWidth = totalCellWidth * 7;

            // Eliminar el contenedor temporal
            document.body.removeChild(tempContainer);

            return calendarWidth;
        },

        _render: function () {
            // Implementación del renderizado de los calendarios mensuales...
            var options = Object.assign({}, this._options.jsCalendarOptions, {
                width: this._options.calendarWidth
            });

            // Renderizar cada mes en la vista
            for (var i = 0; i < 12; i++) {
                var monthContainer = document.createElement('div');
                this._container.appendChild(monthContainer);
                jsCalendar.new(monthContainer, new Date(this._year, i), options);
            }
        }
    };

    // Añadir la extensión a jsCalendar
    jsCalendar.yearmonthview = function (element, options) {
        return new YearMonthView(element, options);
    };

}(window, jsCalendar));
