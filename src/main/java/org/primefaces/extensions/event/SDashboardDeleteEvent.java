/**
 * Copyright 2011-2017 PrimeFaces Extensions
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;

import org.primefaces.event.AbstractAjaxBehaviorEvent;

/**
 * 
 * @author jm
 *
 */
@SuppressWarnings("serial")
public class SDashboardDeleteEvent extends AbstractAjaxBehaviorEvent {

    public static final String NAME = "delete";

    private String deletedWidgetId;

    public SDashboardDeleteEvent(UIComponent component, Behavior behavior, String deletedWidgetId) {
        super(component, behavior);
        this.deletedWidgetId = deletedWidgetId;
    }

    public String getDeletedWidgetId() {
        return deletedWidgetId;
    }

    public void setDeletedWidgetId(String deletedWidgetId) {
        this.deletedWidgetId = deletedWidgetId;
    }

}
