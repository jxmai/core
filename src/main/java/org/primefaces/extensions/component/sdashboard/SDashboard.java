package org.primefaces.extensions.component.sdashboard;

import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.UIComponentBase;
import javax.faces.component.behavior.ClientBehaviorHolder;

import org.primefaces.component.api.Widget;
import org.primefaces.util.ComponentUtils;

@ResourceDependencies({
        @ResourceDependency(library = "primefaces", name = "jquery/jquery.js"),
        @ResourceDependency(library = "primefaces", name = "jquery/jquery-plugins.js"),
        @ResourceDependency(library = "primefaces", name = "core.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "primefaces-extensions.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "sdashboard/sdashboard.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "sdashboard/sdashboard.css")
})
public class SDashboard extends UIComponentBase implements Widget, ClientBehaviorHolder {

    public static final String COMPONENT_TYPE = "org.primefaces.extensions.component.SDashboard";
    public static final String COMPONENT_FAMILY = "org.primefaces.extensions.component";
    private static final String DEFAULT_RENDERER = "org.primefaces.extensions.component.SDashboardRenderer";

    protected enum PropertyKeys {
        widgetVar, widgetId, widgetTitle, widgetContent, onRefreshCallBack;

        String toString;

        PropertyKeys(final String toString) {
            this.toString = toString;
        }

        PropertyKeys() {
        }

        @Override
        public String toString() {
            return toString != null ? toString : super.toString();
        }
    }

    public SDashboard() {
        setRendererType(DEFAULT_RENDERER);
    }

    @Override
    public String getFamily() {
        return COMPONENT_FAMILY;
    }

    @Override
    public String resolveWidgetVar() {
        return ComponentUtils.resolveWidgetVar(getFacesContext(), this);
    }

    public String getWidgetVar() {
        return (String) getStateHelper().eval(PropertyKeys.widgetVar, null);
    }

    public void setWidgetVar(final String _widgetVar) {
        getStateHelper().put(PropertyKeys.widgetVar, _widgetVar);
    }

    public String getWidgetId() {
        return (String) getStateHelper().eval(PropertyKeys.widgetId, null);
    }

    public void setWidgetId(final String _widgetId) {
        getStateHelper().put(PropertyKeys.widgetId, _widgetId);
    }

    public String getWidgetTitle() {
        return (String) getStateHelper().eval(PropertyKeys.widgetTitle, null);
    }

    public void setWidgetTitle(final String _widgetTitle) {
        getStateHelper().put(PropertyKeys.widgetTitle, _widgetTitle);
    }

    public String getWidgetContent() {
        return (String) getStateHelper().eval(PropertyKeys.widgetContent, null);
    }

    public void setWidgetContent(final String _widgetContent) {
        getStateHelper().put(PropertyKeys.widgetContent, _widgetContent);
    }

    public String getOnRefreshCallBack() {
        return (String) getStateHelper().eval(PropertyKeys.onRefreshCallBack, null);
    }

    public void setOnRefreshCallBack(final String _onRefreshCallBack) {
        getStateHelper().put(PropertyKeys.onRefreshCallBack, _onRefreshCallBack);
    }

}
