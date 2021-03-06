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

import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class EventsStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;
        this._instanceEvents = [];
        this._instanceEndpoints = [];

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.INSTANCE_SUBSCRIBED:
                    this._items = {};
                    action.items.forEach((x) => this._setItem(x));
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.INSTANCE_UNSUBSCRIBED:
                    this.destroy();
                    break;

                case this._actions.INSTANCE_CREATED:
                case this._actions.INSTANCE_UPDATED:
                    this._setItem(action.item);
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.INSTANCE_DELETED:
                    this._deleteItem(action.item);
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setItem(item) {
        switch (item.kind) {
            case 'Event':
                this._instanceEvents = this._instanceEvents.concat(item);
                break;

            case 'Endpoints':
                this._instanceEndpoints = this._instanceEndpoints.concat(item);
                break;

            default:
                this._instance = item;
        }
    }

    _deleteItem(item) {
        switch (item.kind) {
            case 'Event':
                this._instanceEvents = _.reject(this._instanceEvents, (x) => x.metadata.uid === item.metadata.uid);
                break;

            case 'Endpoints':
                this._instanceEndpoints = _.reject(this._instanceEndpoints, (x) => x.metadata.uid === item.metadata.uid);
                break;

            default:
                this.destroy();
        }
    }

    getInstance() {
        return this._instance;
    }

    getEvents() {
        return _.chain(this._instanceEvents)
            .clone()
            .reverse()
            .value();
    }

    getEndpoints() {
        return this._instanceEndpoints;
    }

    destroy() {
        delete this._instance;
        this._instanceEvents = [];
        this._instanceEndpoints = [];
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default EventsStoreService;
