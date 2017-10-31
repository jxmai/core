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
public class SDashboardExpandEvent extends AbstractAjaxBehaviorEvent {

    public static final String NAME = "expand";

    private String widgetDefinitionJSONString;

    public SDashboardExpandEvent(UIComponent component, Behavior behavior,
            String widgetDefinitionJSONString) {
        super(component, behavior);
        this.widgetDefinitionJSONString = widgetDefinitionJSONString;
    }

    public String getWidgetDefinitionJSONString() {
        return widgetDefinitionJSONString;
    }

    public void setWidgetDefinitionJSONString(String widgetDefinitionJSONString) {
        this.widgetDefinitionJSONString = widgetDefinitionJSONString;
    }

}
