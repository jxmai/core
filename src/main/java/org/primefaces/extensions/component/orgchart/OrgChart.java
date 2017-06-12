package org.primefaces.extensions.component.orgchart;

import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.UIComponentBase;

import org.primefaces.component.api.Widget;
import org.primefaces.util.ComponentUtils;

@ResourceDependencies({
        @ResourceDependency(library = "primefaces", name = "jquery/jquery.js"),
        @ResourceDependency(library = "primefaces", name = "jquery/jquery-plugins.js"),
        @ResourceDependency(library = "primefaces", name = "core.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "primefaces-extensions.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "orgchart/orgchart.js"),
        @ResourceDependency(library = "primefaces-extensions", name = "orgchart/orgchart.css")
})
public class OrgChart extends UIComponentBase implements Widget {

    public static final String COMPONENT_TYPE = "org.primefaces.extensions.component.OrgChart";
    public static final String COMPONENT_FAMILY = "org.primefaces.extensions.component";
    private static final String DEFAULT_RENDERER = "org.primefaces.extensions.component.orgchart.OrgChartRenderer";

    protected enum PropertyKeys {
        widgetVar, nodeContent, direction, pan, toggleSiblingsResp, depth, exportButton, exportFilename, exportFileextension, parentNodeSymbol, draggable, chartClass, zoom, zoominLimit, zoomoutLimit, verticalDepth;

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

    public OrgChart() {
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

    public String getNodeContent() {
        return (String) getStateHelper().eval(PropertyKeys.nodeContent, "title");
    }

    public void setNodeContent(final String _nodeContent) {
        getStateHelper().put(PropertyKeys.nodeContent, _nodeContent);
    }

    public String getDirection() {
        return (String) getStateHelper().eval(PropertyKeys.direction, "t2b");
    }

    public void setDirection(final String _direction) {
        getStateHelper().put(PropertyKeys.direction, _direction);
    }

    public Boolean getPan() {
        return (Boolean) getStateHelper().eval(PropertyKeys.pan, false);
    }

    public void setPan(final Boolean _pan) {
        getStateHelper().put(PropertyKeys.pan, _pan);
    }

    public Boolean getToggleSiblingsResp() {
        return (Boolean) getStateHelper().eval(PropertyKeys.toggleSiblingsResp, false);
    }

    public void setToggleSiblingsResp(final Boolean _toggleSiblingsResp) {
        getStateHelper().put(PropertyKeys.toggleSiblingsResp, _toggleSiblingsResp);
    }

    public Integer getDepth() {
        return (Integer) getStateHelper().eval(PropertyKeys.depth, 999);
    }

    public void setDepth(final Integer _depth) {
        getStateHelper().put(PropertyKeys.depth, _depth);
    }

    public Boolean getExportButton() {
        return (Boolean) getStateHelper().eval(PropertyKeys.exportButton, false);
    }

    public void setExportButton(final Boolean _exportButton) {
        getStateHelper().put(PropertyKeys.exportButton, _exportButton);
    }

    public String getExportFilename() {
        return (String) getStateHelper().eval(PropertyKeys.exportFilename, "OrgChart");
    }

    public void setExportFilename(final String _exportFilename) {
        getStateHelper().put(PropertyKeys.exportFilename, _exportFilename);
    }

    public String getExportFileextension() {
        return (String) getStateHelper().eval(PropertyKeys.exportFileextension, "png");
    }

    public void setExportFileextension(final String _exportFileextension) {
        getStateHelper().put(PropertyKeys.exportFileextension, _exportFileextension);
    }

    public String getParentNodeSymbol() {
        return (String) getStateHelper().eval(PropertyKeys.parentNodeSymbol, "fa-users");
    }

    public void setParentNodeSymbol(final String _parentNodeSymbol) {
        getStateHelper().put(PropertyKeys.parentNodeSymbol, _parentNodeSymbol);
    }

    public Boolean getDraggable() {
        return (Boolean) getStateHelper().eval(PropertyKeys.draggable, false);
    }

    public void setDraggable(final Boolean _draggable) {
        getStateHelper().put(PropertyKeys.draggable, _draggable);
    }

    public String getChartClass() {
        return (String) getStateHelper().eval(PropertyKeys.chartClass, "");
    }

    public void setChartClass(final String _chartClass) {
        getStateHelper().put(PropertyKeys.chartClass, _chartClass);
    }

    public Boolean getZoom() {
        return (Boolean) getStateHelper().eval(PropertyKeys.zoom, false);
    }

    public void setZoom(final Boolean _zoom) {
        getStateHelper().put(PropertyKeys.zoom, _zoom);
    }

    public Number getZoominLimit() {
        return (Number) getStateHelper().eval(PropertyKeys.zoominLimit, 7);
    }

    public void setZoominLimit(final Number _zoominLimit) {
        getStateHelper().put(PropertyKeys.zoominLimit, _zoominLimit);
    }

    public Number getZoomoutLimit() {
        return (Number) getStateHelper().eval(PropertyKeys.zoomoutLimit, 0.5);
    }

    public void setZoomoutLimit(final Number _zoomoutLimit) {
        getStateHelper().put(PropertyKeys.zoomoutLimit, _zoomoutLimit);
    }

    public Integer getVerticalDepth() {
        return (Integer) getStateHelper().eval(PropertyKeys.verticalDepth, null);
    }

    public void setVerticalDepth(final Integer _verticalDepth) {
        getStateHelper().put(PropertyKeys.verticalDepth, _verticalDepth);
    }

}
