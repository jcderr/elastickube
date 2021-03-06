/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import './ek-confirm.less';
import Directive from 'directive';
import Controller from './ek-confirm.controller';
import template from './ek-confirm.html';

class ConfirmDirective extends Directive {

    constructor($compile) {
        super({ Controller, template });
        this._$compile = $compile;
    }

    compile(tElement) {
        tElement.addClass('ek-confirm');

        return ($scope, $element, attrs, ctrl) => {
            ctrl.options = $scope.$parent.options;
            _.extend($scope, $scope.$parent.options.scope);

            if (ctrl.options.template) {
                const element = angular.element(`<md-dialog-content class="ek-confirm__dialog__content">
                        ${ctrl.options.template}
                    </md-dialog-content>`);

                $element.find('.ek-confirm__dialog').append(element);
                this._$compile(element)($scope);
            }
        };
    }
}

export default ConfirmDirective;
