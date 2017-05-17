package org.primefaces.extensions.event;

import javax.faces.component.UIComponent;
import javax.faces.component.behavior.Behavior;

import org.primefaces.event.AbstractAjaxBehaviorEvent;

@SuppressWarnings("serial")
public class SDashboardReorderEvent extends AbstractAjaxBehaviorEvent {

    public static final String NAME = "reorder";

    private String sortedDefinitionsJSONString;

    public SDashboardReorderEvent(UIComponent component, Behavior behavior,
            String sortedDefinitionsJSONString) {
        super(component, behavior);
        this.sortedDefinitionsJSONString = sortedDefinitionsJSONString;
    }

    public String getSortedDefinitionsJSONString() {
        return sortedDefinitionsJSONString;
    }

    public void setSortedDefinitionsJSONString(String sortedDefinitionsJSONString) {
        this.sortedDefinitionsJSONString = sortedDefinitionsJSONString;
    }

}
