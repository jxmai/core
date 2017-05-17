package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;

import org.primefaces.event.AbstractAjaxBehaviorEvent;

@SuppressWarnings("serial")
public class SDashboardReorderEvent extends AbstractAjaxBehaviorEvent {

    public static final String NAME = "reorder";

    private Object sortedDefinitions;

    public SDashboardReorderEvent(UIComponent component, Behavior behavior,
            Object sortedDefinitions) {
        super(component, behavior);
        this.sortedDefinitions = sortedDefinitions;
    }

    public Object getSortedDefinitions() {
        return sortedDefinitions;
    }

    public void setSortedDefinitions(Object sortedDefinitions) {
        this.sortedDefinitions = sortedDefinitions;
    }

}
