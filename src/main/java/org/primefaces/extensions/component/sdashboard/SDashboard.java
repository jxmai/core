package org.primefaces.extensions.component.sdashboard;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.behavior.ClientBehaviorHolder;
import javax.faces.context.FacesContext;
import javax.faces.event.AjaxBehaviorEvent;
import javax.faces.event.FacesEvent;

import org.primefaces.component.api.UIData;
import org.primefaces.component.api.Widget;
import org.primefaces.extensions.event.SDashboardExpandEvent;
import org.primefaces.extensions.event.SDashboardRefreshEvent;
import org.primefaces.extensions.event.SDashboardReorderEvent;
import org.primefaces.util.ComponentUtils;
import org.primefaces.util.Constants;

@ResourceDependencies({
        @ResourceDependency(library = "primefaces", name = "jquery/jquery.js"),
        @ResourceDependency(library = "primefaces", name = "jquery/jquery-plugins.js"),
        @ResourceDependency(library = "primefaces", name = "core.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "primefaces-extensions.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "sdashboard/sdashboard.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "sdashboard/sdashboard.css")
})
public class SDashboard extends UIData implements Widget, ClientBehaviorHolder {

    public static final String COMPONENT_TYPE = "org.primefaces.extensions.component.SDashboard";
    public static final String COMPONENT_FAMILY = "org.primefaces.extensions.component";
    private static final String DEFAULT_RENDERER = "org.primefaces.extensions.component.SDashboardRenderer";

    private static final Collection<String> EVENT_NAMES = Collections
            .unmodifiableCollection(
                    Arrays.asList(SDashboardRefreshEvent.NAME, SDashboardReorderEvent.NAME,
                            SDashboardExpandEvent.NAME));

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
    public Collection<String> getEventNames() {
        return EVENT_NAMES;
    }

    @Override
    public String getDefaultEventName() {
        return SDashboardRefreshEvent.NAME;
    }

    @Override
    public void processDecodes(FacesContext fc) {
        if (isSelfRequest(fc)) {
            decode(fc);
        } else {
            super.processDecodes(fc);
        }
    }

    @Override
    public void queueEvent(FacesEvent event) {
        FacesContext fc = FacesContext.getCurrentInstance();

        if (isSelfRequest(fc) && event instanceof AjaxBehaviorEvent) {
            Map<String, String> params = fc.getExternalContext().getRequestParameterMap();
            String eventName = params.get(Constants.RequestParams.PARTIAL_BEHAVIOR_EVENT_PARAM);
            AjaxBehaviorEvent behaviorEvent = (AjaxBehaviorEvent) event;
            final String clientId = this.getClientId(fc);

            if (SDashboardRefreshEvent.NAME.equals(eventName)) {
                SDashboardRefreshEvent sDashboardRefreshEvent = new SDashboardRefreshEvent(this,
                        behaviorEvent.getBehavior());
                sDashboardRefreshEvent.setPhaseId(event.getPhaseId());
                super.queueEvent(sDashboardRefreshEvent);
            } else if (SDashboardReorderEvent.NAME.equals(eventName)) {

                String sortedDefinitionsJSONString = params.get(clientId + "_sortedDefinitions");

                SDashboardReorderEvent sDashboardReorderEvent = new SDashboardReorderEvent(this,
                        behaviorEvent.getBehavior(), sortedDefinitionsJSONString);
                sDashboardReorderEvent.setPhaseId(event.getPhaseId());
                super.queueEvent(sDashboardReorderEvent);

            } else if (SDashboardExpandEvent.NAME.equals(eventName)) {
                String widgetDefinitionJSONString = params.get(clientId + "_widgetDefinitions");

                SDashboardExpandEvent sDashboardExpandEvent = new SDashboardExpandEvent(this,
                        behaviorEvent.getBehavior(), widgetDefinitionJSONString);
                sDashboardExpandEvent.setPhaseId(event.getPhaseId());
                super.queueEvent(sDashboardExpandEvent);
            }
        }
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

    private boolean isSelfRequest(final FacesContext context) {
        return this.getClientId(context)
                .equals(context.getExternalContext().getRequestParameterMap().get(
                        Constants.RequestParams.PARTIAL_SOURCE_PARAM));
    }

}
