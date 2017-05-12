package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;
import javax.faces.event.AjaxBehaviorEvent;

@SuppressWarnings("serial")
public class SDashboardRefreshEvent extends AjaxBehaviorEvent {

    public static final String NAME = "refresh";

    public SDashboardRefreshEvent(UIComponent component, Behavior behavior) {
        super(component, behavior);
    }

}
