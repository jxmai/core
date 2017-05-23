package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;

import org.primefaces.event.AbstractAjaxBehaviorEvent;

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
