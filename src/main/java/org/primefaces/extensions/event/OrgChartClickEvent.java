package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;
import javax.faces.event.AjaxBehaviorEvent;

@SuppressWarnings("serial")
public class OrgChartClickEvent extends AjaxBehaviorEvent {

    public static final String NAME = "click";

    private String id;

    public OrgChartClickEvent(UIComponent component, Behavior behavior, String id) {
        super(component, behavior);
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

}
