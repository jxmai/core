package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;
import javax.faces.event.AjaxBehaviorEvent;

import org.primefaces.json.JSONObject;

@SuppressWarnings("serial")
public class OrgChartClickEvent extends AjaxBehaviorEvent {

    public static final String NAME = "click";

    private String id;

    private JSONObject hierarchy;

    public OrgChartClickEvent(UIComponent component, Behavior behavior, String id,
            String hierarchyStr) {
        super(component, behavior);
        this.id = id;
        this.hierarchy = new JSONObject(hierarchyStr);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public JSONObject getHierarchy() {
        return hierarchy;
    }

    public void setHierarchy(JSONObject hierarchy) {
        this.hierarchy = hierarchy;
    }

}
