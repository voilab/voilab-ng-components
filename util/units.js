/*jslint browser: true */
/*global define */

define(function () {
    'use strict';

    var
        /**
         *  Création d'un callback de multiplication
         *
         *  @param  {Number} multiplier
         *
         *  @return {Function}
         */
        multiply = function (multiplier) {
            return function (multiplicand) {
                return Number(multiplicand * multiplier);
            };
        },

        /**
         *  Création d'un callback de division
         *
         *  @param  {Number} divisor
         *
         *  @return {Function}
         */
        divide = function (divisor) {
            return function (dividend) {
                return Number(dividend / divisor);
            };
        },

        /**
         *  Tableau de conversion entre les unités
         *
         *  Le premier niveau est l'untié voulue.
         *  Le second, l'untié source avec à chaque fois une fonction à appeler avec la valeur.
         *
         *  @type {Object}
         */
        ratios = {
            g: {
                kg: multiply(1000)
            },
            kg: {
                g: divide(1000)
            },
            l: {
                dl: divide(10),
                cl: divide(100)
            },
            dl: {
                l: multiply(10),
                cl: divide(10)
            },
            cl: {
                l: multiply(100),
                dl: multiply(10)
            }
        },

        /**
         *  Objet untis
         *
         *  @type {Object}
         */
        units = {
            /**
             *  Conversion d'une valeur d'une unité à une autre.
             *
             *  @param  {Number} value Valeur à convertir
             *  @param  {String} from  Unité source
             *  @param  {String} to    Unité cible
             *
             *  @return {Number}       Valeur convertie ou null si aucune conversion trouvée.
             */
            convert: function (value, from, to) {
                if (from === to) {
                    return Number(value);
                }

                if (!ratios[to] || !ratios[to][from]) {
                    return null;
                }

                return ratios[to][from](value);
            }
        };

    return units;
});
