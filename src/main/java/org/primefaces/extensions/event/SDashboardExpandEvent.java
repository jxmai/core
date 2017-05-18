package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;

import org.primefaces.event.AbstractAjaxBehaviorEvent;

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
