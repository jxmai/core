package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;
import javax.faces.event.AjaxBehaviorEvent;

import org.primefaces.json.JSONObject;

@SuppressWarnings("serial")
public class OrgChartDropEvent extends AjaxBehaviorEvent {

    public static final String NAME = "drop";

    private JSONObject hierarchy;

    private String draggedNodeId;

    private String droppedZoneId;

    public OrgChartDropEvent(UIComponent component, Behavior behavior, String hierarchyStr,
            String draggedNodeId, String droppedZoneId) {
        super(component, behavior);
        this.hierarchy = new JSONObject(hierarchyStr);
        this.draggedNodeId = draggedNodeId;
        this.droppedZoneId = droppedZoneId;
    }

    public JSONObject getHierarchy() {
        return hierarchy;
    }

    public void setHierarchy(JSONObject hierarchy) {
        this.hierarchy = hierarchy;
    }

    public String getDraggedNodeId() {
        return draggedNodeId;
    }

    public void setDraggedNodeId(String draggedNodeId) {
        this.draggedNodeId = draggedNodeId;
    }

    public String getDroppedZoneId() {
        return droppedZoneId;
    }

    public void setDroppedZoneId(String droppedZoneId) {
        this.droppedZoneId = droppedZoneId;
    }

}
