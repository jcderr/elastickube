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

class AdminEditNamespaceController {
    constructor($scope, principalStore, usersStore, namespacesActionCreator) {
        'ngInject';

        this._namespacesActionCreator = namespacesActionCreator;

        this.namespaceName = _.get(this.namespace, 'metadata.name');
        this.users = this.namespace ? _.map(this.namespace.members, (username) => usersStore.get(username))
            : [principalStore.getPrincipal()];

        $scope.$watchGroup(['ctrl.form.$valid', 'ctrl.users'], ([isValid, users]) => {
            this.dialogController.canAccept = isValid && _.size(users) > 0;
        });
    }

    removeUser(user) {
        this.users = _.without(this.users, user);
    }

    accept() {
        if (this.namespace) {
            return this._namespacesActionCreator.updateNamespace(this.namespace, this.namespaceName, this.users);
        }
        return this._namespacesActionCreator.createNamespace(this.namespaceName, this.users);
    }
}

export default AdminEditNamespaceController;
