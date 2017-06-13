package org.primefaces.extensions.component.orgchart;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class OrgChartRendererTest {

    OrgChartRenderer renderer = new OrgChartRenderer();

    OrgChartNode root = new DefaultOrgChartNode("root", "root");

    @Before
    public void before() {
        root.addChild(new DefaultOrgChartNode("children 1", "children 1"));
        root.addChild(new DefaultOrgChartNode("children 2", "children 2"));
    }

    @After
    public void after() {

    }

    @Test
    public void testToJSON() {

        // not a formal test. Only to print the result to console
        System.out.println(renderer.toJSON(root, root.getChildren()));

    }

}
